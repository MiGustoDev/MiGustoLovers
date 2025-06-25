// Función auxiliar para validar variables de entorno requeridas
const getRequiredEnvVar = (name: string, defaultValue: string): string => {
    // Intentar obtener la variable de diferentes formas
    const value = 
        import.meta.env[name] || // Vite
        process?.env?.[name] || // Node.js
        defaultValue; // Valor por defecto
    
    return value;
};

interface Config {
    emailjs: {
        serviceId: string;
        templateId: string;
        publicKey: string;
    };
    sheetdb: {
        url: string;
    };
    security: {
        rateLimit: {
            windowMs: number;
            maxAttempts: number;
        };
        formTokenKey: string;
        apiLimits: {
            daily: number;
            hourly: number;
        };
    };
}

export const config: Config = {
    emailjs: {
        serviceId: String(import.meta.env.VITE_EMAILJS_SERVICE_ID || ''),
        templateId: String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''),
        publicKey: String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '')
    },
    sheetdb: {
        url: String(import.meta.env.VITE_SHEETDB_URL || '')
    },
    security: {
        rateLimit: {
            windowMs: 60 * 60 * 1000, // 1 hora
            maxAttempts: 10 // máximo 10 intentos por hora
        },
        formTokenKey: 'mg_form_token',
        apiLimits: {
            daily: 50,
            hourly: 10
        }
    }
}; 