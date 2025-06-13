import React, { useState } from 'react';
import { Heart, Mail, Phone, MapPin, Check, Star, Users, Gift, ChevronDown } from 'lucide-react';

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
    'Belgrano',
    'Palermo',
    'Villa Crespo',
    'Caballito',
    'San Telmo',
    'Puerto Madero',
    'Recoleta',
    'Barracas'
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

    try {
      // Envío simultáneo de email e integración con CRM
      await Promise.all([
        sendEmailNotification(formData),
        integrateWithCRM(formData)
      ]);

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
    );
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)'}}>
      {/* Header */}
      <header style={{background: 'rgba(24,24,24,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)', position: 'sticky', top: 0, zIndex: 50}}>
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 44, height: 44, background: 'linear-gradient(135deg, #FFD700 0%, #f7c873 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Heart style={{width: 28, height: 28, color: '#181818'}} />
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

      {/* Hero Section */}
      <section style={{padding: '3.5rem 0 2.5rem 0'}}>
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: 48}}>
            <div style={{display: 'inline-flex', alignItems: 'center', background: 'rgba(255,215,0,0.10)', borderRadius: 32, padding: '0.7rem 2.2rem', marginBottom: 24}}>
              <Star style={{width: 18, height: 18, color: '#FFD700', marginRight: 8}} />
              <span style={{color: '#FFD700', fontWeight: 600, fontSize: '1rem'}}>Programa Exclusivo de Beneficios</span>
            </div>
            <h1 style={{fontSize: '2.8rem', fontWeight: 900, color: '#FFD700', marginBottom: 24, letterSpacing: 1}}>Mi Gusto Lovers</h1>
            <p style={{fontSize: '1.25rem', color: '#fff', marginBottom: 32, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5}}>
              Únete a nuestro programa exclusivo y disfruta de beneficios únicos, descuentos especiales 
              y experiencias gastronómicas irrepetibles en todas nuestras sucursales.
            </p>
            {/* Benefits Preview */}
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', marginTop: 32, marginBottom: 48}}>
              <div className="glass-card" style={{minWidth: 260, maxWidth: 320, textAlign: 'center', border: '1.5px solid #FFD700'}}>
                <div style={{width: 48, height: 48, background: 'rgba(255,215,0,0.13)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
                  <Gift style={{width: 28, height: 28, color: '#FFD700'}} />
                </div>
                <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 12}}>Descuentos Exclusivos</h3>
                <p style={{color: '#fff', fontSize: '1rem'}}>Hasta 25% de descuento en tus platos favoritos y promociones especiales solo para miembros.</p>
              </div>
              <div className="glass-card" style={{minWidth: 260, maxWidth: 320, textAlign: 'center', border: '1.5px solid #FFD700'}}>
                <div style={{width: 48, height: 48, background: 'rgba(255,215,0,0.13)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
                  <Users style={{width: 28, height: 28, color: '#FFD700'}} />
                </div>
                <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 12}}>Eventos Exclusivos</h3>
                <p style={{color: '#fff', fontSize: '1rem'}}>Invitaciones a cenas especiales, catas y eventos gastronómicos únicos.</p>
              </div>
              <div className="glass-card" style={{minWidth: 260, maxWidth: 320, textAlign: 'center', border: '1.5px solid #FFD700'}}>
                <div style={{width: 48, height: 48, background: 'rgba(255,215,0,0.13)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
                  <Star style={{width: 28, height: 28, color: '#FFD700'}} />
                </div>
                <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 12}}>Experiencias VIP</h3>
                <p style={{color: '#fff', fontSize: '1rem'}}>Acceso prioritario, reservas especiales y atención personalizada en todas las sucursales.</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div style={{maxWidth: 540, margin: '0 auto'}}>
            <div className="glass-card" style={{border: '1.5px solid #FFD700'}}>
              <div style={{textAlign: 'center', marginBottom: 32}}>
                <h2 style={{color: '#FFD700', fontWeight: 800, fontSize: '2rem', marginBottom: 12}}>
                  Únete a Mi Gusto Lovers
                </h2>
                <p style={{color: '#fff', fontSize: '1.1rem'}}>
                  Completa tus datos y comienza a disfrutar de beneficios exclusivos
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div style={{marginBottom: 18}}>
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
                {/* Email */}
                <div style={{marginBottom: 18}}>
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
                {/* Teléfono */}
                <div style={{marginBottom: 18}}>
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
                {/* Cliente existente */}
                <div style={{marginBottom: 18}}>
                  <label>¿Ya eres cliente de Mi Gusto? *</label>
                  <div style={{display: 'flex', gap: 32, marginTop: 8}}>
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
                {/* Sucursal */}
                <div style={{marginBottom: 18}}>
                  <label htmlFor="sucursal">Sucursal habitual *</label>
                  <select
                    id="sucursal"
                    name="sucursal"
                    value={formData.sucursal}
                    onChange={handleInputChange}
                    className={errors.sucursal ? 'input-error' : ''}
                  >
                    <option value="">Selecciona una sucursal</option>
                    {sucursales.map(suc => (
                      <option key={suc} value={suc}>{suc}</option>
                    ))}
                  </select>
                  {errors.sucursal && (
                    <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.sucursal}</p>
                  )}
                </div>
                {/* Beneficios */}
                <div style={{marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12}}>
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
                <button type="submit" className="btn" style={{width: '100%', marginTop: 8}} disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Unirme ahora'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;