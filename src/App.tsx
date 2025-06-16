import React, { useState, useRef, useEffect } from 'react';
import { Heart, Mail, Phone, MapPin, Check, Star, Users, Gift, ChevronDown } from 'lucide-react';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import MiGustoTitulo from './assets/MiGustoTitulo.png';
import Empanada1 from './assets/Empanadas/Mexican-Veggie-demo.png';
import Empanada2 from './assets/Empanadas/Mexican-Pibil-Pork-demo.png';
import Empanada3 from './assets/Empanadas/Matambre a la pizza.png';
import Empanada4 from './assets/Empanadas/burger.png';
import { FaInstagram } from 'react-icons/fa';

// Registrar el locale en español
registerLocale('es', es);

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  esCliente: string;
  sucursal: string;
  aceptaBeneficios: boolean;
  cumple: string; // Fecha de cumpleaños
  saboresFavoritos: string[]; // Hasta 3 sabores
}

interface FormErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
  esCliente?: string;
  sucursal?: string;
  cumple?: string;
  saboresFavoritos?: string;
}

function ParticlesBG() {
  const empanadas = [Empanada1, Empanada2, Empanada3, Empanada4];
  // 28 partículas con posiciones y delays aleatorios, tamaños y duraciones variadas
  const particles = Array.from({length: 28}).map((_, i) => {
    const left = Math.random() * 100;
    // Tamaños variados: más grandes y más pequeñas
    const size = 54 + Math.random() * 64; // 54px a 118px
    const delay = Math.random() * 8;
    // Duración más variada: caídas lentas y rápidas
    const duration = 5 + Math.random() * 7; // 5s a 12s
    const rotate = Math.random() * 360;
    const img = empanadas[Math.floor(Math.random() * empanadas.length)];
    return (
      <img
        key={i}
        src={img}
        className="empanada-particle"
        alt="empanada"
        style={{
          left: `${left}%`,
          width: size,
          height: size,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          '--rot': `${rotate}deg`
        } as React.CSSProperties}
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
    aceptaBeneficios: false,
    cumple: '',
    saboresFavoritos: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saboresDropdownOpen, setSaboresDropdownOpen] = useState(false);
  const saboresDropdownRef = useRef<HTMLDivElement>(null);
  const [cumpleDropdownOpen, setCumpleDropdownOpen] = useState(false);
  const cumpleDropdownRef = useRef<HTMLDivElement>(null);
  const cumpleInputRef = useRef<HTMLInputElement>(null);

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

  const sabores = [
    'Mexican Pibil Pork',
    'Mexican Veggie',
    'Big Burger',
    'Vacio y provoleta',
    'Matambre a la pizza',
    'CheeseBurger',
    'Jamon y queso',
    'American Chicken',
    'Jamon, queso y huevo',
    'Carne Picante',
    'Jamon, Tomate y albahaca',
    'Carne al cuchillo',
    'Queso y Cebolla',
    'Carne Suave',
    'Roquefort con jamon',
    'Carne con aceituna',
    'Pollo',
    'Cuatro Quesos',
    'Pollo al champignon',
    'Choclo',
    'Verdura',
    'Calabaza',
    'Pance y ciruela',
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

    if (!formData.cumple) {
      newErrors.cumple = 'La fecha de cumpleaños es obligatoria';
    }

    if (!formData.saboresFavoritos.length) {
      newErrors.saboresFavoritos = 'Selecciona al menos un sabor favorito';
    } else if (formData.saboresFavoritos.length > 3) {
      newErrors.saboresFavoritos = 'Solo puedes seleccionar hasta 3 sabores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'saboresFavoritos') {
      const options = (e.target as HTMLSelectElement).options;
      const selected: string[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(options[i].value);
      }
      setFormData(prev => ({
        ...prev,
        saboresFavoritos: selected
      }));
      if (selected.length > 3) {
        setErrors(prev => ({ ...prev, saboresFavoritos: 'Solo puedes seleccionar hasta 3 sabores' }));
      } else {
        setErrors(prev => ({ ...prev, saboresFavoritos: undefined }));
      }
      return;
    }
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
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handler especial para chips de sabores
  const handleSaborChipClick = (sabor: string) => {
    let nuevosSabores = [...formData.saboresFavoritos];
    if (nuevosSabores.includes(sabor)) {
      nuevosSabores = nuevosSabores.filter(s => s !== sabor);
    } else {
      if (nuevosSabores.length < 3) {
        nuevosSabores.push(sabor);
      }
    }
    setFormData(prev => ({ ...prev, saboresFavoritos: nuevosSabores }));
    if (nuevosSabores.length > 3) {
      setErrors(prev => ({ ...prev, saboresFavoritos: 'Solo puedes seleccionar hasta 3 sabores' }));
    } else {
      setErrors(prev => ({ ...prev, saboresFavoritos: undefined }));
    }
  };

  // Función para formatear la fecha a dd-mm-aaaa
  function formatearFecha(fechaISO: string) {
    if (!fechaISO) return '';
    const [a, m, d] = fechaISO.split('-');
    return `${d}-${m}-${a}`;
  }

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
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Preparar los datos para el correo
        const templateParams = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          cumple: formatearFecha(formData.cumple),
          saboresFavoritos: formData.saboresFavoritos.join(', '),
          cliente: formData.esCliente === 'si' ? 'Sí' : 'No',
          sucursal: formData.sucursal,
          novedades: formData.aceptaBeneficios ? 'Sí' : 'No'
        };

        // Enviar correo usando EmailJS
        await emailjs.send(
          'service_vroveb8',
          'template_jhm5j3n',
          templateParams,
          '2muZYDfZaoXaOzlBc'
        );

        // Preparar datos para SheetDB
        const sheetData = {
          data: [{
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            sucursal: formData.sucursal,
            esCliente: formData.esCliente === 'si' ? 'si' : 'no',
            aceptaBeneficios: formData.aceptaBeneficios ? 'Sí' : 'No',
            cumple: formatearFecha(formData.cumple),
            saboresFavoritos: formData.saboresFavoritos.join(', ')
          }]
        };

        // Enviar datos a SheetDB
        const response = await fetch('https://sheetdb.io/api/v1/ecz01n89ku4yj', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sheetData)
        });

        if (!response.ok) {
          throw new Error(`Error al guardar en Excel: ${response.status}`);
        }

        setIsSubmitted(true);
        setTimeout(() => {
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            esCliente: '',
            sucursal: '',
            aceptaBeneficios: false,
            cumple: '',
            saboresFavoritos: []
          });
          setIsSubmitted(false);
        }, 5000);
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (saboresDropdownRef.current && !saboresDropdownRef.current.contains(event.target as Node)) {
        setSaboresDropdownOpen(false);
      }
    }
    if (saboresDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [saboresDropdownOpen]);

  // Cerrar el dropdown de cumpleaños si se hace clic fuera
  useEffect(() => {
    function handleClickOutsideCumple(event: MouseEvent) {
      if (cumpleDropdownRef.current && !cumpleDropdownRef.current.contains(event.target as Node)) {
        setCumpleDropdownOpen(false);
      }
    }
    if (cumpleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutsideCumple);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideCumple);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideCumple);
    };
  }, [cumpleDropdownOpen]);

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
              <div className="logo-glow-container" style={{position: 'relative', width: 130, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div className="logo-gold-border"></div>
                <div style={{position: 'absolute', top: 0, left: 0, width: 130, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
                  <img src={MiGustoTitulo} alt="Mi Gusto Lovers Club" style={{height: 38, maxWidth: 110, display: 'block'}} />
                </div>
                <p style={{color: '#FFD700', fontWeight: 600, fontSize: '1rem', margin: 0, textAlign: 'center', position: 'relative', zIndex: 1, marginTop: 68}}>Lovers Club</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, color: '#FFD700'}}>
                <a 
                  href="https://www.instagram.com/migustoar/?hl=es" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{display: 'flex', alignItems: 'center', gap: 8, color: '#FFD700', textDecoration: 'none'}}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    style={{color: '#FFD700'}}
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span style={{fontSize: '1rem'}}>MiGustoAR</span>
                </a>
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
                {/* Nueva fila: Cumpleaños y Sabores */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, rowGap: 0, marginBottom: 12}}>
                  <div>
                    <label>Fecha de cumpleaños *</label>
                    <div style={{position: 'relative', marginBottom: 8}}>
                      <DatePicker
                        selected={formData.cumple ? new Date(formData.cumple) : null}
                        onChange={(date: Date | null) => {
                          setFormData(prev => ({
                            ...prev,
                            cumple: date ? date.toISOString().split('T')[0] : ''
                          }));
                          if (errors.cumple) {
                            setErrors(prev => ({ ...prev, cumple: undefined }));
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        placeholderText="Elegir mi cumpleaños"
                        className={`btn btn-select ${errors.cumple ? 'input-error' : ''}`}
                        wrapperClassName="datepicker-wrapper"
                        popperClassName="datepicker-popper"
                        popperPlacement="bottom-start"
                        showPopperArrow={false}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        locale="es"
                        customInput={
                          <button
                            type="button"
                            className="btn btn-select"
                            style={{
                              width: '100%',
                              justifyContent: 'space-between',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '1.05rem',
                              padding: '0.7rem 1.2rem'
                            }}
                          >
                            {formData.cumple
                              ? new Date(formData.cumple).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
                              : 'Elegir mi cumpleaños'}
                            <span style={{marginLeft: 8}}>
                              📅
                            </span>
                          </button>
                        }
                      />
                    </div>
                    <small style={{color: '#FFD700', fontSize: '0.95rem'}}>Solo para saludarte en tu día :)</small>
                    {errors.cumple && (
                      <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.cumple}</p>
                    )}
                  </div>
                  <div>
                    <label>Tus 3 sabores favoritos *</label>
                    <div style={{position: 'relative', marginBottom: 8}} ref={saboresDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setSaboresDropdownOpen(v => !v)}
                        aria-expanded={saboresDropdownOpen}
                        className="btn btn-select"
                        style={{
                          width: '100%',
                          justifyContent: 'space-between',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '1.05rem',
                          padding: '0.7rem 1.2rem'
                        }}
                      >
                        {formData.saboresFavoritos.length === 0 ? 'Elegir mis 3 sabores favoritos' : 'Editar sabores favoritos'}
                        <span style={{marginLeft: 8, transition: 'transform 0.2s', transform: saboresDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                          ▼
                        </span>
                      </button>
                      {saboresDropdownOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '110%',
                            left: 0,
                            zIndex: 100,
                            background: 'rgba(24,24,24,0.97)',
                            border: '1.5px solid #FFD700',
                            borderRadius: 18,
                            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
                            padding: '1.1rem 1.1rem 0.7rem 1.1rem',
                            minWidth: 260,
                            maxWidth: 340,
                            minHeight: 80,
                            maxHeight: 260,
                            overflowY: 'auto',
                            animation: 'fadeInDropdown 0.22s',
                          }}
                        >
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6, marginTop: 2}}>
                            {sabores.map(sabor => (
                              <button
                                type="button"
                                key={sabor}
                                onClick={() => handleSaborChipClick(sabor)}
                                className={formData.saboresFavoritos.includes(sabor) ? 'chip-sabor chip-sabor-selected' : 'chip-sabor'}
                                style={{
                                  border: '1.5px solid #FFD700',
                                  borderRadius: 18,
                                  padding: '0.45rem 1.1rem',
                                  background: formData.saboresFavoritos.includes(sabor) ? 'linear-gradient(90deg, #FFD700 0%, #f7c873 100%)' : 'rgba(24,24,24,0.55)',
                                  color: formData.saboresFavoritos.includes(sabor) ? '#181818' : '#FFD700',
                                  fontWeight: 600,
                                  fontSize: '1.01rem',
                                  cursor: 'pointer',
                                  boxShadow: formData.saboresFavoritos.includes(sabor) ? '0 2px 10px 0 rgba(255,215,0,0.13)' : 'none',
                                  transition: 'all 0.18s',
                                  outline: 'none',
                                  marginBottom: 4
                                }}
                                disabled={
                                  !formData.saboresFavoritos.includes(sabor) && formData.saboresFavoritos.length >= 3
                                }
                              >
                                {sabor}
                              </button>
                            ))}
                          </div>
                          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <button
                              type="button"
                              className="btn"
                              style={{fontSize: '1rem', padding: '0.4rem 1.2rem', borderRadius: 12, marginTop: 6}}
                              onClick={() => setSaboresDropdownOpen(false)}
                            >
                              Listo
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Chips resumen */}
                      {formData.saboresFavoritos.length > 0 && !saboresDropdownOpen && (
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8}}>
                          {formData.saboresFavoritos.map(sabor => (
                            <span
                              key={sabor}
                              style={{
                                border: '1.5px solid #FFD700',
                                borderRadius: 14,
                                padding: '0.22rem 0.8rem',
                                background: 'rgba(255,215,0,0.13)',
                                color: '#FFD700',
                                fontWeight: 600,
                                fontSize: '0.98rem',
                                marginBottom: 2
                              }}
                            >
                              {sabor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <small style={{color: '#FFD700', fontSize: '0.95rem'}}>Puedes elegir hasta 3 sabores</small>
                    {errors.saboresFavoritos && (
                      <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.saboresFavoritos}</p>
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