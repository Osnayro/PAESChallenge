
/**
 * ============================================================
 * PAES Challenge — Sabiondo Effects Manager v1.2.0
 * Efectos visuales académicos (Canvas 2D) + Sonidos + Toasts
 * Para "PAES Challenge: Desafío de Admisión Universitaria"
 * ============================================================
 *
 * ARCHIVOS DE SONIDO REQUERIDOS EN /sounds/:
 *   - splash.mp3      → Pantalla de carga
 *   - correct.mp3     → Respuesta correcta
 *   - incorrect.mp3   → Respuesta incorrecta
 *   - levelup.mp3     → Subir de nivel
 *   - levelstart.mp3  → Iniciar nivel
 *   - achievement.mp3 → Nueva insignia
 *   - powerup.mp3     → Usar power-up
 *   - star.mp3        → Efecto de estrellas
 *   - next.mp3        → Siguiente pregunta
 */

class ContiEffectsManager {

    constructor(config = {}) {
        this.canvas = document.getElementById(config.canvasId || 'effects-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        if (this.canvas) {
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }

        this.scoreBadge = config.scoreBadgeId
            ? document.getElementById(config.scoreBadgeId)
            : null;

        this.maxParticles = config.maxParticles || 300;
        this.masterVolume = Math.min(1, Math.max(0, config.masterVolume ?? 0.8));

        this.particles = [];
        this.floatingTexts = [];
        this.animationId = null;
        this.isRunning = false;

        // ================================================================
        // REGISTRO DE ARCHIVOS DE SONIDO
        // Todos deben existir en la carpeta /sounds/
        // ================================================================
        this.soundFiles = {
            splash:      'sounds/splash.mp3',
            correct:     'sounds/correct.mp3',
            incorrect:   'sounds/incorrect.mp3',
            levelup:     'sounds/levelup.mp3',
            levelstart:  'sounds/levelstart.mp3',
            achievement: 'sounds/achievement.mp3',
            powerup:     'sounds/powerup.mp3',
            star:        'sounds/star.mp3',
            next:        'sounds/next.mp3'
        };

        // Pool de audio para reproducción simultánea
        this.audioPool = [];
        this.maxAudioPool = 9;
        this.audioPoolIndex = 0;

        // Buffers de audio precargados
        this.audioBuffers = {};
        this.audioLoaded = false;
        this.audioLoadError = false;
        this.soundsLoadedCount = 0;
        this.soundsTotalCount = Object.keys(this.soundFiles).length;

        // AudioContext para síntesis de sonido (tick, fallback)
        this.audioCtx = null;
        this.audioCtxReady = false;

        // Paleta de colores académica
        this.colors = {
            star:      ['#FFD700', '#FFC107', '#FFB300', '#FFA000', '#FFF8DC', '#FFE082'],
            estrellas: ['#FFD700', '#FFC107', '#FFB300', '#FFA000', '#FFF8DC', '#FFE082'],
            confetti:  [
                '#1E3A63', '#3B82F6', '#8B5CF6', '#FFD700', '#10B981',
                '#F59E0B', '#EC4899', '#6366F1', '#14B8A6', '#84CC16',
                '#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626'
            ],
            libro:     ['#8B5CF6', '#6366F1', '#A78BFA', '#C4B5FD', '#DDD6FE', '#7C3AED'],
            fuego:     ['#FF4500', '#FFD700', '#FF6347', '#FFA500', '#FFFFFF', '#FF1493', '#00FF88', '#3B82F6'],
            pluma:     ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6'],
            magic:     ['#A78BFA', '#818CF8', '#C4B5FD', '#6366F1', '#DDD6FE'],
        };

        window.effectsManager = this;

        this.startLoop();
        this._preloadSounds();

        console.log('🦉 Sabiondo Effects Manager v1.2.0 listo');
        console.log('📁 Sonidos a cargar:', this.soundsTotalCount, 'archivos');
        console.log('🔊 Volumen:', this.masterVolume);
    }

    // ================================================================
    //  CANVAS
    // ================================================================

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startLoop() {
        if (this.isRunning || !this.canvas) return;
        this.isRunning = true;
        const loop = () => {
            if (!this.isRunning) return;
            this._update();
            this._draw();
            this.animationId = requestAnimationFrame(loop);
        };
        this.animationId = requestAnimationFrame(loop);
    }

    stopLoop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    _update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.rotation += p.rotationSpeed;
            p.life -= p.decay;

            if (p.attractTo && this.scoreBadge && p.life < p.maxLife * 0.6) {
                const r = this.scoreBadge.getBoundingClientRect();
                const tx = r.left + r.width / 2;
                const ty = r.top + r.height / 2;
                const dx = tx - p.x;
                const dy = ty - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                p.vx += (dx / dist) * 0.1;
                p.vy += (dy / dist) * 0.1;
            }

            if (p.life <= 0 || p.y > this.canvas.height + 120 || p.x < -120 || p.x > this.canvas.width + 120) {
                this.particles.splice(i, 1);
            }
        }

        while (this.particles.length > this.maxParticles) {
            this.particles.shift();
        }

        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.life -= ft.decay;
            ft.alpha = Math.max(0, ft.life / ft.maxLife);
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    _draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.scale(p.scale, p.scale);

            switch (p.type) {
                case 'star':
                case 'estrella':
                    this._drawEstrella(ctx, p);
                    break;
                case 'confetti':
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                    break;
                case 'circle':
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'libro':
                    this._drawLibro(ctx, p);
                    break;
                case 'pluma':
                    this._drawPluma(ctx, p);
                    break;
                default:
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }
            ctx.restore();
        }

        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = ft.alpha;
            ctx.font = `${ft.fontWeight} ${ft.fontSize}px 'Poppins', sans-serif`;
            ctx.fillStyle = ft.color;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
            ctx.shadowBlur = 6;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        }
    }

    // ================================================================
    //  DIBUJOS DE PARTÍCULAS
    // ================================================================

    _drawEstrella(ctx, p) {
        const spikes = 5;
        const outerR = p.size;
        const innerR = p.size * 0.4;

        const grad = ctx.createRadialGradient(0, 0, innerR * 0.3, 0, 0, outerR);
        grad.addColorStop(0, '#FFFDE7');
        grad.addColorStop(0.4, '#FFD700');
        grad.addColorStop(0.8, '#FFA000');
        grad.addColorStop(1, '#B8860B');

        ctx.fillStyle = grad;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const sx = Math.cos(angle) * radius;
            const sy = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    _drawLibro(ctx, p) {
        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-p.size / 2, -p.size * 0.15);
        ctx.lineTo(-p.size / 2, p.size * 0.6);
        ctx.lineTo(0, p.size * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7C3AED';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p.size / 2, -p.size * 0.15);
        ctx.lineTo(p.size / 2, p.size * 0.6);
        ctx.lineTo(0, p.size * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
            const y = -p.size * 0.05 + i * p.size * 0.15;
            ctx.beginPath();
            ctx.moveTo(-p.size * 0.35, y);
            ctx.lineTo(-p.size * 0.05, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.size * 0.05, y);
            ctx.lineTo(p.size * 0.35, y);
            ctx.stroke();
        }

        ctx.strokeStyle = '#4C1D95';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.08);
        ctx.lineTo(0, p.size * 0.55);
        ctx.stroke();
    }

    _drawPluma(ctx, p) {
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.25, p.size, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(0, p.size);
        ctx.stroke();
    }

    // ================================================================
    //  EFECTOS VISUALES ACADÉMICOS
    // ================================================================

    triggerStarExplosion(x, y, count = 15) {
        if (!this.canvas) return;
        count = Math.min(count, 50);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 9;
            this.particles.push({
                type: 'star',
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 5,
                gravity: 0.18,
                friction: 0.985,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.35,
                scale: 0.55 + Math.random() * 0.9,
                size: 10 + Math.random() * 10,
                life: 1, maxLife: 1,
                decay: 0.005 + Math.random() * 0.01,
                color: this.colors.star[Math.floor(Math.random() * this.colors.star.length)],
                attractTo: true,
            });
        }
    }

    triggerBookExplosion(x, y, count = 10) {
        if (!this.canvas) return;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push({
                type: 'libro',
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                gravity: 0.15, friction: 0.97,
                rotation: Math.random() * Math.PI,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                scale: 0.5 + Math.random() * 0.8,
                size: 8 + Math.random() * 10,
                life: 1, maxLife: 1,
                decay: 0.008 + Math.random() * 0.012,
                color: this.colors.libro[Math.floor(Math.random() * this.colors.libro.length)],
                attractTo: false,
            });
        }
    }

    triggerStarRain(count = 30) {
        if (!this.canvas) return;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.particles.push({
                    type: 'star',
                    x: Math.random() * this.canvas.width,
                    y: -40,
                    vx: (Math.random() - 0.5) * 3.5,
                    vy: 3 + Math.random() * 6,
                    gravity: 0.14, friction: 0.994,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.25,
                    scale: 0.45 + Math.random() * 0.55,
                    size: 7 + Math.random() * 8,
                    life: 1, maxLife: 1,
                    decay: 0.004 + Math.random() * 0.007,
                    color: this.colors.star[Math.floor(Math.random() * this.colors.star.length)],
                    attractTo: false,
                });
            }, i * 45);
        }
    }

    triggerConfettiAcademico(duration = 2500, density = 3) {
        if (!this.canvas) return;
        const startTime = performance.now();
        const colors = this.colors.confetti;
        const spawn = (now) => {
            if (now - startTime > duration) return;
            for (let i = 0; i < density; i++) {
                this.particles.push({
                    type: 'confetti',
                    x: Math.random() * this.canvas.width,
                    y: -25,
                    vx: (Math.random() - 0.5) * 5,
                    vy: 2 + Math.random() * 5,
                    gravity: 0.06, friction: 0.994,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.25,
                    scale: 0.7 + Math.random() * 1.3,
                    size: 8 + Math.random() * 14,
                    life: 1, maxLife: 1,
                    decay: 0.003 + Math.random() * 0.006,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    attractTo: false,
                });
            }
            requestAnimationFrame(spawn);
        };
        requestAnimationFrame(spawn);
    }

    triggerFuegosAcademicos(count = 3) {
        if (!this.canvas) return;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = this.canvas.width * (0.2 + Math.random() * 0.6);
                const y = this.canvas.height * (0.12 + Math.random() * 0.28);
                this._burstAcademicFirework(x, y);
            }, i * 400 + Math.random() * 300);
        }
    }

    _burstAcademicFirework(x, y) {
        const colors = this.colors.fuego;
        const count = 50 + Math.floor(Math.random() * 40);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 9;
            this.particles.push({
                type: 'star',
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 0.09, friction: 0.965,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.12,
                scale: 0.3 + Math.random() * 0.6,
                size: 4 + Math.random() * 8,
                life: 1, maxLife: 1,
                decay: 0.009 + Math.random() * 0.016,
                color: colors[Math.floor(Math.random() * colors.length)],
                attractTo: false,
            });
        }
    }

    triggerPlumasVoladoras(count = 12) {
        if (!this.canvas) return;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.particles.push({
                    type: 'pluma',
                    x: Math.random() * this.canvas.width,
                    y: -20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: 1 + Math.random() * 3,
                    gravity: 0.02, friction: 0.996,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.15,
                    scale: 0.6 + Math.random() * 0.8,
                    size: 6 + Math.random() * 8,
                    life: 1, maxLife: 1,
                    decay: 0.002 + Math.random() * 0.005,
                    color: this.colors.pluma[Math.floor(Math.random() * this.colors.pluma.length)],
                    attractTo: false,
                });
            }, i * 60);
        }
    }

    triggerScreenFlash(duration = 200) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(30, 58, 99, 0.2));
            z-index: 998; pointer-events: none;
            opacity: 0.6; transition: opacity ${duration}ms ease-out;
        `;
        document.body.appendChild(flash);
        requestAnimationFrame(() => { flash.style.opacity = '0'; });
        setTimeout(() => flash.remove(), duration + 60);
    }

    triggerScoreBadgeFlash() {
        if (!this.scoreBadge) return;
        this.scoreBadge.classList.add('ultra-pop');
        setTimeout(() => this.scoreBadge.classList.remove('ultra-pop'), 600);
        const rect = this.scoreBadge.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            this.particles.push({
                type: 'star',
                x: cx, y: cy,
                vx: Math.cos(angle) * 2.5,
                vy: Math.sin(angle) * 2.5,
                gravity: 0, friction: 0.9,
                rotation: 0, rotationSpeed: 0,
                scale: 0.5, size: 3 + Math.random() * 3,
                life: 1, maxLife: 1, decay: 0.035,
                color: '#FFD700', attractTo: false,
            });
        }
    }

    triggerExplosion(x, y, scale = 1.0, color = '#FFD700') {
        if (!this.canvas) return;
        const count = Math.floor(22 * scale);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (2 + Math.random() * 7) * scale;
            this.particles.push({
                type: 'star', x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 0.12, friction: 0.955,
                rotation: 0, rotationSpeed: 0,
                scale: 0.45 + Math.random() * 0.85,
                size: 3 + Math.random() * 9 * scale,
                life: 1, maxLife: 1,
                decay: 0.014 + Math.random() * 0.022,
                color: color, attractTo: false,
            });
        }
    }

    triggerFloatingText(x, y, text, options = {}) {
        if (!this.canvas) return;
        this.floatingTexts.push({
            x, y, text, vy: -1.6,
            life: 1, maxLife: 1, decay: 0.011, alpha: 1,
            color: options.color || '#FFD700',
            fontSize: options.fontSize || 28,
            fontWeight: options.fontWeight || '800',
        });
    }

    // ================================================================
    //  TOASTS
    // ================================================================

    triggerToastAcademico(message, options = {}) {
        const { icon = '🦉', bg = 'linear-gradient(135deg, #1E3A63, #3B82F6)', duration = 3000, position = 'top' } = options;
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);z-index:2000;display:flex;flex-direction:column;gap:12px;pointer-events:none;';
            document.body.appendChild(container);
        }
        container.style.top = position === 'center' ? '40%' : '8%';
        const toast = document.createElement('div');
        toast.style.cssText = `background:${bg};color:white;padding:15px 26px;border-radius:18px;font-weight:700;font-size:0.95rem;font-family:'Poppins',sans-serif;text-align:center;box-shadow:0 14px 35px rgba(0,0,0,0.28);pointer-events:auto;animation:toastSlideIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards;display:flex;align-items:center;gap:12px;white-space:nowrap;letter-spacing:0.3px;`;
        toast.innerHTML = '<span style="font-size:1.6rem;line-height:1">' + icon + '</span> ' + message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.4s ease-in forwards';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // ================================================================
    //  MÉTODOS DE CONVENIENCIA (COMPATIBILIDAD)
    // ================================================================

    triggerStarsFromElement(element, count = 15) {
        if (!element || !this.canvas) return;
        const rect = element.getBoundingClientRect();
        this.triggerStarExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
        this.playSound('star');
    }

    triggerBooksFromElement(element, count = 10) {
        if (!element || !this.canvas) return;
        const rect = element.getBoundingClientRect();
        this.triggerBookExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
    }

    triggerCoinExplosion(x, y, count) { this.triggerStarExplosion(x, y, count); }
    triggerCoinExplosionFromElement(element, count) { this.triggerStarsFromElement(element, count); }
    triggerConfetti(duration, density) { this.triggerConfettiAcademico(duration, density); }
    triggerFireworks(count) { this.triggerFuegosAcademicos(count); }
    triggerCoinRain() { this.triggerStarRain(); }
    triggerToast(message, options) { this.triggerToastAcademico(message, options); }

    // ================================================================
    //  AUDIO - PRECARGA DE SONIDOS
    // ================================================================

    _preloadSounds(onProgress) {
        const loaderFill = document.getElementById('loader-fill');
        const loaderLabel = document.getElementById('loader-label');

        if (loaderFill) {
            loaderFill.style.width = '0%';
            loaderFill.style.animation = 'none';
        }
        if (loaderLabel) {
            loaderLabel.textContent = 'Cargando sonidos...';
        }

        for (let i = 0; i < this.maxAudioPool; i++) {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.volume = this.masterVolume;
            this.audioPool.push(audio);
        }

        for (const [key, path] of Object.entries(this.soundFiles)) {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = path;
            audio.volume = this.masterVolume;

            audio.addEventListener('canplaythrough', () => {
                this.soundsLoadedCount++;
                this.audioBuffers[key] = audio;
                if (loaderFill) {
                    const progress = (this.soundsLoadedCount / this.soundsTotalCount) * 100;
                    loaderFill.style.width = progress + '%';
                }
                if (loaderLabel) {
                    loaderLabel.textContent = `Cargando sonidos... (${this.soundsLoadedCount}/${this.soundsTotalCount})`;
                }
                if (onProgress) onProgress(this.soundsLoadedCount, this.soundsTotalCount);
                if (this.soundsLoadedCount === this.soundsTotalCount) {
                    this.audioLoaded = true;
                    console.log('✅ Todos los sonidos cargados:', this.soundsTotalCount, 'archivos');
                    this._showSplashButton();
                }
            }, { once: true });

            audio.addEventListener('error', () => {
                this.soundsLoadedCount++;
                console.warn('⚠️ Error al cargar sonido:', path);
                if (loaderFill) {
                    loaderFill.style.width = (this.soundsLoadedCount / this.soundsTotalCount) * 100 + '%';
                }
                if (onProgress) onProgress(this.soundsLoadedCount, this.soundsTotalCount);
                if (this.soundsLoadedCount === this.soundsTotalCount && !this.audioLoaded) {
                    this.audioLoadError = true;
                    console.warn('⚠️ Algunos sonidos no se cargaron. La app funcionará sin ellos.');
                    this._showSplashButton();
                }
            });

            audio.load();
        }
    }

    _showSplashButton() {
        const loaderFill = document.getElementById('loader-fill');
        const loaderLabel = document.getElementById('loader-label');
        const skipBtn = document.getElementById('skip-splash-btn');
        const splashScreen = document.getElementById('splash-screen');

        if (loaderFill) loaderFill.style.width = '100%';
        if (loaderLabel) {
            loaderLabel.textContent = '¡Listo! Sabiondo te espera 🦉';
            loaderLabel.style.color = '#10B981';
        }
        if (skipBtn) {
            skipBtn.style.display = 'flex';
            skipBtn.classList.add('ready');
            skipBtn.disabled = false;
            skipBtn.addEventListener('click', () => {
                this.initGlobalAudio();
                this.playSound('splash');
                if (splashScreen) splashScreen.classList.add('hidden');
            }, { once: true });
        }
    }

    // ================================================================
    //  AUDIO - CONTEXTO GLOBAL
    // ================================================================

    initGlobalAudio() {
        if (this.audioCtxReady) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) { console.warn('Web Audio API no disponible.'); return; }
        try {
            this.audioCtx = new AudioCtx();
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume().then(() => {
                    this.audioCtxReady = true;
                }).catch(err => console.warn('No se pudo reanudar AudioContext:', err));
            } else {
                this.audioCtxReady = true;
            }
        } catch (e) {
            console.warn('Error al crear AudioContext:', e);
        }
    }

    // ================================================================
    //  AUDIO - REPRODUCCIÓN
    // ================================================================

    playSound(type) {
        if (!this.audioLoaded && !this.audioLoadError) return;
        if (!this.soundFiles[type]) {
            console.warn('Sonido no reconocido:', type);
            return;
        }
        const sourceAudio = this.audioBuffers[type];
        if (!sourceAudio) return;
        const poolAudio = this.audioPool[this.audioPoolIndex];
        this.audioPoolIndex = (this.audioPoolIndex + 1) % this.maxAudioPool;
        poolAudio.src = this.soundFiles[type];
        poolAudio.volume = this.masterVolume;
        const playPromise = poolAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => console.debug('🔇 Audio bloqueado:', type, '-', err.message));
        }
    }

    playIncorrectFallback() {
        if (!this.audioLoaded && !this.audioLoadError) return;
        const audio = new Audio('sounds/incorrect.mp3');
        audio.volume = this.masterVolume;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => this._playIncorrectWithAudioContext());
        }
        audio.addEventListener('ended', () => audio.remove());
    }

    _playIncorrectWithAudioContext() {
        if (!this.audioCtxReady || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') { this.audioCtx.resume(); return; }
        const ctx = this.audioCtx;
        const now = ctx.currentTime;
        const vol = this.masterVolume;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.38);
        gain.gain.setValueAtTime(0.00001, now);
        gain.gain.exponentialRampToValueAtTime(0.16 * vol, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    }

    playTick() {
        if (!this.audioCtxReady || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') { this.audioCtx.resume(); return; }
        const ctx = this.audioCtx;
        const now = ctx.currentTime;
        const vol = this.masterVolume;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.00001, now);
        gain.gain.exponentialRampToValueAtTime(0.3 * vol, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    ensureAudio() { return; }
    isSoundLoaded(type) { return !!this.audioBuffers[type]; }
    getSoundLoadProgress() {
        if (this.soundsTotalCount === 0) return 1;
        return this.soundsLoadedCount / this.soundsTotalCount;
    }
}

// ================================================================
//  INICIALIZACIÓN AUTOMÁTICA
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (!window.effectsManager) {
        window.effectsManager = new ContiEffectsManager({
            canvasId: 'effects-canvas',
            scoreBadgeId: 'score-badge',
            maxParticles: 300,
            masterVolume: 0.8,
        });
    }
});
