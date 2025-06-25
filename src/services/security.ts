import { config } from '../config';

interface RateLimitInfo {
    attempts: number;
    firstAttempt: number;
}

interface APIUsageInfo {
    emailCount: number;
    sheetDbCount: number;
    lastReset: number;
}

class SecurityService {
    private readonly DAILY_LIMIT = 50; // Límite diario de llamadas a API
    private readonly HOURLY_LIMIT = 10; // Límite por hora
    private readonly RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas en ms

    private getStorageKey(key: string): string {
        return `mg_${key}_${new Date().toDateString()}`;
    }

    private getAPIUsage(): APIUsageInfo {
        const key = this.getStorageKey('api_usage');
        const stored = localStorage.getItem(key);
        if (!stored) {
            return { emailCount: 0, sheetDbCount: 0, lastReset: Date.now() };
        }
        return JSON.parse(stored);
    }

    private updateAPIUsage(type: 'email' | 'sheetdb'): boolean {
        const usage = this.getAPIUsage();
        const now = Date.now();

        // Resetear contadores si ha pasado el intervalo
        if (now - usage.lastReset > this.RESET_INTERVAL) {
            usage.emailCount = 0;
            usage.sheetDbCount = 0;
            usage.lastReset = now;
        }

        // Verificar límites
        if (type === 'email' && usage.emailCount >= this.DAILY_LIMIT) {
            return false;
        }
        if (type === 'sheetdb' && usage.sheetDbCount >= this.DAILY_LIMIT) {
            return false;
        }

        // Actualizar contadores
        if (type === 'email') usage.emailCount++;
        if (type === 'sheetdb') usage.sheetDbCount++;

        localStorage.setItem(this.getStorageKey('api_usage'), JSON.stringify(usage));
        return true;
    }

    private getRateLimitInfo(): RateLimitInfo {
        const key = this.getStorageKey('rate_limit');
        const stored = localStorage.getItem(key);
        if (!stored) {
            return { attempts: 0, firstAttempt: Date.now() };
        }
        return JSON.parse(stored);
    }

    private updateRateLimit(info: RateLimitInfo) {
        const key = this.getStorageKey('rate_limit');
        localStorage.setItem(key, JSON.stringify(info));
    }

    public async checkAPILimit(type: 'email' | 'sheetdb'): Promise<boolean> {
        // Verificar rate limit general
        if (!this.checkRateLimit()) {
            throw new Error('Has excedido el límite de intentos. Por favor, espera unos minutos.');
        }

        // Verificar límite específico de API
        if (!this.updateAPIUsage(type)) {
            throw new Error(`Has alcanzado el límite diario de uso de la API de ${type}.`);
        }

        return true;
    }

    public checkRateLimit(): boolean {
        const info = this.getRateLimitInfo();
        const now = Date.now();

        // Si ha pasado la ventana de tiempo, reiniciar
        if (now - info.firstAttempt > config.security.rateLimit.windowMs) {
            this.updateRateLimit({ attempts: 1, firstAttempt: now });
            return true;
        }

        // Si excede los intentos máximos
        if (info.attempts >= config.security.rateLimit.maxAttempts) {
            return false;
        }

        // Incrementar intentos
        this.updateRateLimit({
            attempts: info.attempts + 1,
            firstAttempt: info.firstAttempt
        });
        return true;
    }

    public generateFormToken(): string {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem(config.security.formTokenKey, token);
        return token;
    }

    public validateFormToken(token: string): boolean {
        return sessionStorage.getItem(config.security.formTokenKey) === token;
    }

    public sanitizeInput(input: string): string {
        if (!input) return '';
        return input
            .replace(/[<>]/g, '') // Prevenir XSS básico
            .trim()
            .slice(0, 500); // Limitar longitud
    }

    public validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length < 100;
    }

    public validatePhone(phone: string): boolean {
        const phoneRegex = /^[\d\s\-\+\(\)]{6,20}$/;
        return phoneRegex.test(phone);
    }
}

export const securityService = new SecurityService(); 