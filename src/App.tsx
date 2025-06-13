import React, { useState } from 'react';
import { Heart, Mail, Phone, MapPin, Check, Star, Users, Gift, ChevronDown } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  esCliente: string;
  sucursal: string;
  aceptaBeneficios: boolean;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
  esCliente?: string;
  sucursal?: string;
}

function ParticlesBG() {
  // 20 partículas con posiciones y delays aleatorios
  const particles = Array.from({length: 20}).map((_, i) => {
    const left = Math.random() * 100;
    const size = 8 + Math.random() * 18;
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 4;
    return (
      <div
        key={i}
        className="particle"
        style={{
          left: `${left}%`,
          width: size,
          height: size,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });
  return <div className="particles-bg">{particles}</div>;
}

function Confetti() {
  // 24 piezas de confeti con posiciones y rotaciones aleatorias
  const confetti = Array.from({length: 24}).map((_, i) => {
    const left = 40 + Math.random() * 20;
    const top = Math.random() * 20;
    const rotate = Math.random() * 360;
    const delay = Math.random() * 0.5;
    return (
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          transform: `rotate(${rotate}deg)`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });
  return <div className="confetti">{confetti}</div>;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    esCliente: '',
    sucursal: '',
    aceptaBeneficios: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sucursales = [
    'Ballester',
    'Balvanera',
    'Barrancas',
    'Belgrano',
    'Bella Vista',
    'Campana',
    'Del Viso',
    'Devoto',
    'Don Torcuato',
    'Escobar',
    'Floresta',
    'Florida',
    'Gral. Pacheco',
    'Hurlingham',
    'Ituzaingo',
    'Jose C. Paz',
    'Los Polvorines',
    'Martinez',
    'Maschwitz',
    'Mataderos',
    'Merlo',
    'Moreno',
    'Muñiz',
    'Munro',
    'Palermo',
    'Paternal',
    'Pilar Centro',
    'Pilar Derqui',
    'Puerto Madero',
    'San Fernando',
    'San Martin',
    'San Miguel',
    'Tigre',
    'Tortugas Norte',
    'Villa Adelina',
    'Villa Crespo',
    'Villa Urquiza',
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El formato del teléfono no es válido';
    }

    if (!formData.esCliente) {
      newErrors.esCliente = 'Debe indicar si ya es cliente';
    }

    if (!formData.sucursal) {
      newErrors.sucursal = 'Debe seleccionar una sucursal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const sendEmailNotification = async (data: FormData) => {
    // Simulación del envío de email
    console.log('Enviando email a lovers@migusto.com.ar con datos:', data);
    
    // Simulamos una llamada API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const integrateWithCRM = async (data: FormData) => {
    // Simulación de integración con Mailchimp/Datalive
    console.log('Integrando con CRM/Email Marketing:', data);
    
    const crmData = {
      email: data.email,
      firstName: data.nombre.split(' ')[0],
      lastName: data.nombre.split(' ').slice(1).join(' '),
      phone: data.telefono,
      customFields: {
        esCliente: data.esCliente,
        sucursal: data.sucursal,
        aceptaBeneficios: data.aceptaBeneficios,
        programa: 'Mi Gusto Lovers',
        fechaRegistro: new Date().toISOString()
      }
    };

    // Simulamos una llamada API al CRM
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, contactId: 'MLV_' + Date.now() });
      }, 800);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepara los datos para el template de EmailJS
    const templateParams = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      esCliente: formData.esCliente,
      sucursal: formData.sucursal,
      aceptaBeneficios: formData.aceptaBeneficios ? 'Sí' : 'No',
    };

    try {
      await emailjs.send(
        'service_vroveb8',
        'template_jhm5j3n',
        templateParams,
        '2muZYDfZaoXaOzlBc'
      );
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          esCliente: '',
          sucursal: '',
          aceptaBeneficios: false
        });
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      alert('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <ParticlesBG />
        <Confetti />
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)'}}>
          <div className="glass-card" style={{maxWidth: 480, width: '100%', textAlign: 'center'}}>
            <div style={{width: 80, height: 80, background: 'rgba(255,215,0,0.13)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
              <Check style={{width: 40, height: 40, color: '#FFD700'}} />
            </div>
            <h2 style={{color: '#FFD700', fontWeight: 800, fontSize: '2rem', marginBottom: 16}}>¡Bienvenido a Mi Gusto Lovers!</h2>
            <p style={{color: '#fff', marginBottom: 24}}>
              Tu registro ha sido procesado exitosamente. Pronto recibirás un email con todos los detalles 
              de tu membresía y beneficios exclusivos.
            </p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#FFD700'}}>
              <Heart style={{width: 20, height: 20, color: '#FFD700'}} />
              <span style={{fontWeight: 600}}>¡Gracias por unirte a nuestra comunidad!</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ParticlesBG />
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)'}}>
        {/* Header */}
        <header style={{background: 'rgba(24,24,24,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)', position: 'sticky', top: 0, zIndex: 50}}>
          <div style={{maxWidth: 1200, margin: '0 auto', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{width: 44, height: 44, background: 'linear-gradient(135deg, #FFD700 0%, #f7c873 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Heart className="heartbeat" style={{width: 28, height: 28, color: '#181818'}} />
              </div>
              <div>
                <h1 style={{color: '#FFD700', fontWeight: 900, fontSize: '1.5rem', margin: 0}}>Mi Gusto</h1>
                <p style={{color: '#FFD700', fontWeight: 600, fontSize: '1rem', margin: 0}}>Lovers Program</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, color: '#FFD700'}}>
                <Mail style={{width: 18, height: 18}} />
                <span style={{fontSize: '1rem'}}>lovers@migusto.com.ar</span>
              </div>
            </div>
          </div>
        </header>

        {/* Layout horizontal en desktop */}
        <section style={{height: 'calc(100vh - 80px)', minHeight: 600, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', maxWidth: 1400, margin: '0 auto', padding: '24px 1.2rem 0 1.2rem', gap: 24}}>
          {/* Columna izquierda: Hero y cards */}
          <div style={{flex: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, maxWidth: 520, paddingRight: 24}}>
            <div style={{textAlign: 'left', marginBottom: 18}}>
              <div style={{display: 'inline-flex', alignItems: 'center', background: 'rgba(255,215,0,0.10)', borderRadius: 32, padding: '0.5rem 1.2rem', marginBottom: 14}}>
                <Star style={{width: 15, height: 15, color: '#FFD700', marginRight: 6}} />
                <span style={{color: '#FFD700', fontWeight: 600, fontSize: '0.95rem'}}>Programa Exclusivo de Beneficios</span>
              </div>
              <h1 className="text-outline-gold" style={{fontSize: '2.1rem', fontWeight: 900, color: '#FFD700', marginBottom: 16, letterSpacing: 0.5, textAlign: 'left'}}>Mi Gusto Lovers</h1>
              <p className="text-outline-gold" style={{fontSize: '1.05rem', color: '#fff', marginBottom: 18, maxWidth: 420, lineHeight: 1.4, textAlign: 'left'}}>
                Únete a nuestro programa exclusivo y disfruta de beneficios únicos, descuentos especiales 
                y experiencias gastronómicas irrepetibles en todas nuestras sucursales.
              </p>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'flex-start', marginTop: 18, marginBottom: 0}}>
                <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #FFD700', padding: '1.1rem 0.7rem'}}>
                  <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                    <Gift style={{width: 18, height: 18, color: '#FFD700'}} />
                  </div>
                  <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>Descuentos</h3>
                  <p style={{color: '#fff', fontSize: '0.92rem'}}>Hasta 25% de descuento y promos especiales.</p>
                </div>
                <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #FFD700', padding: '1.1rem 0.7rem'}}>
                  <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                    <Users style={{width: 18, height: 18, color: '#FFD700'}} />
                  </div>
                  <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>Eventos</h3>
                  <p style={{color: '#fff', fontSize: '0.92rem'}}>Cenas, catas y eventos únicos.</p>
                </div>
                <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #FFD700', padding: '1.1rem 0.7rem'}}>
                  <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                    <Star style={{width: 18, height: 18, color: '#FFD700'}} />
                  </div>
                  <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>VIP</h3>
                  <p style={{color: '#fff', fontSize: '0.92rem'}}>Reservas y atención prioritaria.</p>
                </div>
                <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #FFD700', padding: '1.1rem 0.7rem'}}>
                  <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                    <Gift style={{width: 18, height: 18, color: '#FFD700'}} />
                  </div>
                  <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>Sorteos y Premios</h3>
                  <p style={{color: '#fff', fontSize: '0.92rem'}}>Participa por premios y experiencias exclusivas.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Columna derecha: Formulario */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minWidth: 0, maxWidth: 600, paddingTop: 32}}>
            <div className="glass-card fade-in-right" style={{border: '1.5px solid #FFD700', padding: '2.2rem 2.2rem 2.2rem 2.2rem', maxWidth: 600, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div style={{textAlign: 'center', marginBottom: 18}}>
                <h2 style={{color: '#FFD700', fontWeight: 800, fontSize: '1.25rem', marginBottom: 8}}>
                  Únete a Mi Gusto Lovers
                </h2>
                <p style={{color: '#fff', fontSize: '0.98rem'}}>
                  Completa tus datos y comienza a disfrutar de beneficios exclusivos
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                {/* Primera fila: Nombre y Email */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, rowGap: 0, marginBottom: 12}}>
                  <div>
                    <label htmlFor="nombre">Nombre completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={errors.nombre ? 'input-error' : ''}
                      placeholder="Tu nombre completo"
                    />
                    {errors.nombre && (
                      <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.nombre}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'input-error' : ''}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.email}</p>
                    )}
                  </div>
                </div>
                {/* Segunda fila: Teléfono y Sucursal */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, rowGap: 0, marginBottom: 12}}>
                  <div>
                    <label htmlFor="telefono">Teléfono *</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={errors.telefono ? 'input-error' : ''}
                      placeholder="+54 11 1234-5678"
                    />
                    {errors.telefono && (
                      <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.telefono}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="sucursal">Sucursal habitual *</label>
                    <div style={{width: '90%'}}>
                      <select
                        id="sucursal"
                        name="sucursal"
                        value={formData.sucursal}
                        onChange={handleInputChange}
                        className={errors.sucursal ? 'input-error' : ''}
                        style={{width: '100%'}}
                      >
                        <option value="">Selecciona una sucursal</option>
                        {sucursales.map(suc => (
                          <option key={suc} value={suc}>{suc}</option>
                        ))}
                      </select>
                    </div>
                    {errors.sucursal && (
                      <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.sucursal}</p>
                    )}
                  </div>
                </div>
                {/* Tercera fila: ¿Ya eres cliente? y botón */}
                <div style={{display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 12, flexWrap: 'wrap'}}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <label>¿Ya eres cliente de Mi Gusto? *</label>
                    <div style={{display: 'flex', gap: 24, marginTop: 8}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <input
                          type="radio"
                          name="esCliente"
                          value="si"
                          checked={formData.esCliente === 'si'}
                          onChange={handleInputChange}
                          style={{accentColor: '#FFD700'}}
                        />
                        <span style={{color: '#fff'}}>Sí</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <input
                          type="radio"
                          name="esCliente"
                          value="no"
                          checked={formData.esCliente === 'no'}
                          onChange={handleInputChange}
                          style={{accentColor: '#FFD700'}}
                        />
                        <span style={{color: '#fff'}}>No</span>
                      </label>
                    </div>
                    {errors.esCliente && (
                      <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.esCliente}</p>
                    )}
                  </div>
                  <div style={{flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    <button type="submit" className="btn btn-shine" style={{width: '100%', minWidth: 120, marginTop: 0}} disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Unirme ahora'}
                    </button>
                  </div>
                </div>
                {/* Beneficios */}
                <div style={{marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12}}>
                  <input
                    type="checkbox"
                    id="aceptaBeneficios"
                    name="aceptaBeneficios"
                    checked={formData.aceptaBeneficios}
                    onChange={handleInputChange}
                    style={{accentColor: '#FFD700', width: 18, height: 18, margin: 0}}
                  />
                  <label htmlFor="aceptaBeneficios" style={{margin: 0, color: '#FFD700', fontWeight: 500, fontSize: '1rem', cursor: 'pointer'}}>
                    Quiero recibir novedades y beneficios exclusivos
                  </label>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;