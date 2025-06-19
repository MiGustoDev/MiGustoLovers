import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import backgroundText from './assets/background-text.jpg';

// Estilos globales para el modal
const modalStyles = `
  @keyframes fadeIn {
    from { 
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to { 
      opacity: 1;
      backdrop-filter: blur(8px);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Estilos para la barra de scroll */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #181818;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #e53935;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #f7c873;
  }

  .modal-content {
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modal-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  }

  .modal-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .modal-section-title {
    color: #e53935;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
  }

  .modal-text {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .modal-link {
    color: #e53935;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .modal-link:hover {
    color: #f7c873;
    text-decoration: underline;
  }
`;

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  esCliente: string;
  sucursal: string;
  aceptaBeneficios: boolean;
  cumple: string;
  saboresFavoritos: string[];
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
  // Solo se genera una vez y nunca se reinicia
  const particles = useMemo(() =>
    Array.from({length: 28}).map((_, i) => {
      const left = Math.random() * 100;
      const size = 54 + Math.random() * 64;
      const delay = -Math.random() * 8;
      const duration = 5 + Math.random() * 7;
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
    })
  , []); // Solo se ejecuta una vez
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
  const [formData, setFormData] = useState<FormData>(() => {
    // Intentar recuperar datos del localStorage al iniciar
    const savedData = localStorage.getItem('migustoFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error al cargar datos guardados:', e);
      }
    }
    return {
      nombre: '',
      email: '',
      telefono: '',
      cumple: '',
      saboresFavoritos: [],
      esCliente: '',
      sucursal: '',
      aceptaBeneficios: false
    };
  });

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('migustoFormData', JSON.stringify(formData));
  }, [formData]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saboresDropdownOpen, setSaboresDropdownOpen] = useState(false);
  const saboresDropdownRef = useRef<HTMLDivElement>(null);
  const [cumpleDropdownOpen, setCumpleDropdownOpen] = useState(false);
  const cumpleDropdownRef = useRef<HTMLDivElement>(null);
  const cumpleInputRef = useRef<HTMLInputElement>(null);
  const [showPrivacidad, setShowPrivacidad] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
        // Aquí se "guardan" automáticamente las empanadas seleccionadas al cerrar
        // (ya se actualizan en tiempo real, pero esto fuerza el cierre y el guardado visual)
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

  // Protección contra inspección y clic derecho
  useEffect(() => {
    // Deshabilitar teclas de inspección
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, F12
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    // Agregar event listeners
    document.addEventListener('keydown', handleKeyDown);

    // Limpiar event listeners al desmontar
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSubmitted) {
    return (
      <>
        <style>{modalStyles}</style>
        <ParticlesBG />
        <Confetti />
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)'}}>
          <div className="glass-card" style={{maxWidth: 480, width: '100%', textAlign: 'center'}}>
            <div style={{width: 80, height: 80, background: 'rgba(255,215,0,0.13)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
              <Check style={{width: 40, height: 40, color: '#e53935'}} />
          </div>
            <h2 style={{color: '#e53935', fontWeight: 800, fontSize: '2rem', marginBottom: 16}}>¡Bienvenido a Mi Gusto Lovers!</h2>
            <p style={{color: '#fff', marginBottom: 24}}>
            Tu registro ha sido procesado exitosamente. Pronto recibirás un email con todos los detalles 
            de tu membresía y beneficios exclusivos.
          </p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#e53935'}}>
              <Heart style={{width: 20, height: 20, color: '#e53935'}} />
              <span style={{fontWeight: 600}}>¡Gracias por unirte a nuestra comunidad!</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{modalStyles}</style>
      <header style={{background: 'rgba(24,24,24,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)', position: 'sticky', top: 0, zIndex: 10}}>
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexDirection: 'column'}}>
          {/* Logo, MiGustoTitulo e Instagram arriba */}
          <div style={{display: 'flex', alignItems: 'center', gap: 16, minWidth: 180, justifyContent: 'center', width: '100%'}}>
            <div style={{width: 44, height: 44, background: 'linear-gradient(135deg, #e53935 0%, #f7c873 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Heart className="heartbeat" style={{width: 28, height: 28, color: '#181818'}} />
            </div>
            <div style={{position: 'relative', width: 130, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img src={MiGustoTitulo} alt="Mi Gusto Lovers Club" className="logo-migusto-navbar" style={{height: 54, maxWidth: 160, display: 'block'}} />
            </div>
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
                {windowWidth > 900 && (
                  <span style={{fontSize: '1rem', color: '#FFD700'}}>MiGustoAR</span>
                )}
              </a>
            </div>
          </div>
          {/* Lovers Club debajo de todo */}
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 0}}>
            <div className="lovers-glow-container" style={{height: 38, minWidth: 0, width: 'auto'}}>
              <div className="lovers-maroon-border" style={{height: 38, width: 'auto', minWidth: 0}}></div>
              <span className="lovers-club-text" style={{fontSize: '1.05rem', padding: '0.3rem 1.2rem', borderRadius: 14, marginTop: 10}}>Lovers Club</span>
            </div>
          </div>
        </div>
      </header>
      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(rgba(24,24,24,0.72), rgba(24,24,24,0.82)), url(${backgroundText}) center/cover no-repeat fixed`,
          width: '100%',
        }}
      >
        <section
          style={{
            width: '100%',
            minWidth: '0',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="container-responsive"
            style={{
              width: '100%',
              minWidth: '0',
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflowX: 'hidden',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: windowWidth > 900 ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: windowWidth > 900 ? 24 : 0,
              background: 'transparent',
            }}
          >
            {/* Columna izquierda: Hero y cards */}
            <div
              style={{
                flex: 1.1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
                maxWidth: windowWidth > 900 ? 520 : '100%',
                marginBottom: windowWidth <= 900 ? 18 : 0,
                position: 'relative',
                marginTop: 32
              }}
            >
              {/* Empanadas caen detrás de las cards en desktop */}
              {windowWidth > 900 && (
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none'}}>
                  <ParticlesBG />
                </div>
              )}
              <div style={{
                textAlign: windowWidth <= 900 ? 'center' : 'left',
                marginBottom: 18,
                alignItems: windowWidth <= 900 ? 'center' : 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                position: 'relative',
                zIndex: 1,
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', background: 'rgba(255,215,0,0.10)', borderRadius: 32, padding: '0.5rem 1.2rem', marginBottom: 14, marginTop: 14,
                  justifyContent: 'center',
                  width: windowWidth <= 900 ? '100%' : 'auto'}}>
                <Star style={{width: 15, height: 15, color: '#e53935', marginRight: 6}} />
                <span className="metallic-gradient-text" style={{fontWeight: 600, fontSize: '0.95rem'}}>Programa Exclusivo de Beneficios</span>
              </div>
                <h1 className="text-outline-gold" style={{fontSize: '2.1rem', fontWeight: 900, color: '#FFD700', marginBottom: 16, letterSpacing: 0.5, textAlign: windowWidth <= 900 ? 'center' : 'left', width: '100%', textShadow: '0 2px 18px #FFD700cc, 0 0px 2px #f8e434, 1px 1px 0 #181818'}}>Mi Gusto Lovers</h1>
                <p className="text-outline-gold" style={{fontSize: '1.05rem', color: '#fff', marginBottom: 18, maxWidth: 420, lineHeight: 1.4, textAlign: windowWidth <= 900 ? 'center' : 'left', width: '100%', marginLeft: windowWidth <= 900 ? 'auto' : 0, marginRight: windowWidth <= 900 ? 'auto' : 0, textShadow: '0 2px 18px #FFD700cc, 0 0px 2px #f8e434, 1px 1px 0 #181818'}}>
                Únete a nuestro programa exclusivo y disfruta de beneficios únicos, descuentos especiales 
                y experiencias gastronómicas irrepetibles en todas nuestras sucursales.
              </p>
                <div className="benefits-cards-mobile" style={{
                  display: windowWidth > 900 ? 'flex' : 'grid',
                  flexWrap: windowWidth > 900 ? 'wrap' : undefined,
                  gridTemplateColumns: windowWidth <= 900 ? '1fr 1fr' : undefined,
                  gap: 16,
                  justifyItems: windowWidth <= 900 ? 'center' : undefined,
                  alignItems: windowWidth <= 900 ? 'stretch' : undefined,
                  width: '100%',
                  margin: windowWidth <= 900 ? '0 auto 18px auto' : '18px 0 0 0'
                }}>
                  <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #e53935', padding: '1.1rem 0.7rem'}}>
                    <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                      <Gift style={{width: 18, height: 18, color: '#e53935'}} />
                    </div>
                    <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>Descuentos</h3>
                    <p style={{color: '#fff', fontSize: '0.92rem'}}>Hasta 25% de descuento y promos especiales.</p>
                  </div>
                  <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #e53935', padding: '1.1rem 0.7rem'}}>
                    <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                      <Users style={{width: 18, height: 18, color: '#e53935'}} />
                    </div>
                    <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>Eventos</h3>
                    <p style={{color: '#fff', fontSize: '0.92rem'}}>Cenas, catas y eventos únicos.</p>
                  </div>
                  <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #e53935', padding: '1.1rem 0.7rem'}}>
                    <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                      <Star style={{width: 18, height: 18, color: '#e53935'}} />
                </div>
                    <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>VIP</h3>
                    <p style={{color: '#fff', fontSize: '0.92rem'}}>Reservas y atención prioritaria.</p>
                  </div>
                  <div className="glass-card fade-in-up" style={{minWidth: 160, maxWidth: 180, textAlign: 'center', border: '1.5px solid #e53935', padding: '1.1rem 0.7rem'}}>
                    <div className="icon-anim" style={{width: 32, height: 32, background: 'rgba(255,215,0,0.13)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem auto'}}>
                      <Gift style={{width: 18, height: 18, color: '#e53935'}} />
                </div>
                    <h3 style={{color: '#FFD700', fontWeight: 700, marginBottom: 7, fontSize: '1.05rem'}}>Sorteos y Premios</h3>
                    <p style={{color: '#fff', fontSize: '0.92rem'}}>Participa por premios y experiencias exclusivas.</p>
                  </div>
                </div>
                {windowWidth <= 900 && <ParticlesBG />}
              </div>
            </div>
            {/* Columna derecha: Formulario */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
                maxWidth: windowWidth > 900 ? 600 : '100%',
                position: 'relative',
                zIndex: 10
              }}
            >
              <div
                className="glass-card fade-in-right"
                style={{
                  border: '1.5px solid #e53935',
                  padding: windowWidth <= 900 ? '1.2rem 0.5rem' : '2.2rem 2.2rem 2.2rem 2.2rem',
                  width: '100%',
                  maxWidth: windowWidth <= 900 ? '100%' : 600,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginTop: 32
                }}
              >
                <div style={{textAlign: 'center', marginBottom: 18}}>
                  <h2 style={{color: '#e53935', fontWeight: 800, fontSize: '1.25rem', marginBottom: 8}}>
                    Únete a Mi Gusto Lovers
                  </h2>
                  <p style={{color: '#fff', fontSize: '0.98rem'}}>
                    Completa tus datos y comienza a disfrutar de beneficios exclusivos
                  </p>
                </div>
                <form onSubmit={handleSubmit} style={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden', padding: 0, margin: 0 }}>
                  {/* Primera fila: Nombre y Email */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, rowGap: 0, marginBottom: 12, width: '100%', boxSizing: 'border-box', minWidth: 0, maxWidth: '100%'}}>
                  <div>
                      <label htmlFor="nombre">Nombre completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`form-field-short${errors.nombre ? ' input-error' : ''}`}
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
                        className={`form-field-short${errors.email ? ' input-error' : ''}`}
                        placeholder="tu@email.com"
                      />
                      {errors.email && (
                        <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.email}</p>
                      )}
                    </div>
                  </div>
                  {/* Nueva fila: Cumpleaños y Sabores */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, rowGap: 0, marginBottom: 12, width: '100%', boxSizing: 'border-box', minWidth: 0, maxWidth: '100%'}}>
                    <div>
                      <label>Fecha de cumpleaños *</label>
                      <div style={{position: 'relative', marginBottom: 8}}>
                        <DatePicker
                          selected={formData.cumple ? new Date(formData.cumple + 'T00:00:00') : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              const formattedDate = `${year}-${month}-${day}`;
                              setFormData(prev => ({
                                ...prev,
                                cumple: formattedDate
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                cumple: ''
                              }));
                            }
                            if (errors.cumple) {
                              setErrors(prev => ({ ...prev, cumple: undefined }));
                            }
                          }}
                          dateFormat="dd/MM/yyyy"
                          maxDate={new Date()}
                          placeholderText="Elegir mi cumpleaños"
                          className={`btn-select form-field-short${errors.cumple ? ' input-error' : ''}`}
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
                              className={`btn-select form-field-short${errors.cumple ? ' input-error' : ''}`}
                              style={{
                                width: '100%',
                                maxWidth: 260,
                                justifyContent: 'space-between',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '1.05rem',
                                padding: '0.9rem 1.2rem 1.8rem 1.2rem',
                                color: '#FFD700'
                              }}
                            >
                              {formData.cumple
                                ? new Date(formData.cumple + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
                                : 'Elegir mi cumpleaños'}
                              <span style={{marginLeft: 8}}>
                                📅
                              </span>
                            </button>
                          }
                        />
                      </div>
                      <small style={{color: '#e53935', fontSize: '0.95rem'}}>Solo para saludarte en tu día :)</small>
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
                          className={`btn-select form-field-short${errors.saboresFavoritos ? ' input-error' : ''}`}
                          style={{
                            width: '100%',
                            maxWidth: 260,
                            justifyContent: 'space-between',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1.05rem',
                            padding: '0.9rem 1.2rem 0.9rem 1.2rem',
                            color: '#FFD700'
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
                              border: '1.5px solid #e53935',
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
                                    border: '1.5px solid #e53935',
                                    borderRadius: 18,
                                    padding: '0.45rem 1.1rem',
                                    background: formData.saboresFavoritos.includes(sabor) ? 'linear-gradient(90deg, #e53935 0%, #f7c873 100%)' : 'rgba(24,24,24,0.55)',
                                    color: formData.saboresFavoritos.includes(sabor) ? '#181818' : '#e53935',
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
                                  border: '1.5px solid #e53935',
                                  borderRadius: 14,
                                  padding: '0.22rem 0.8rem',
                                  background: 'rgba(255,215,0,0.13)',
                                  color: '#e53935',
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
                      <small style={{color: '#e53935', fontSize: '0.95rem'}}>Puedes elegir hasta 3 sabores</small>
                      {errors.saboresFavoritos && (
                        <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.saboresFavoritos}</p>
                      )}
                    </div>
                  </div>
                  {/* Segunda fila: Teléfono y Sucursal */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, rowGap: 0, marginBottom: 12, width: '100%', boxSizing: 'border-box', minWidth: 0, maxWidth: '100%'}}>
                  <div>
                      <label htmlFor="telefono">Teléfono *</label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className={`form-field-short${errors.telefono ? ' input-error' : ''}`}
                        placeholder="+54 11 1234-5678"
                        style={{ paddingLeft: windowWidth <= 900 ? 12 : undefined }}
                      />
                      {errors.telefono && (
                        <p style={{color: '#ff4d4f', fontSize: '1rem', margin: 0}}>{errors.telefono}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="sucursal">Sucursal habitual *</label>
                      <div style={{width: '90%', marginLeft: windowWidth <= 900 ? 12 : 0}}>
                        <select
                          id="sucursal"
                          name="sucursal"
                          value={formData.sucursal}
                          onChange={handleInputChange}
                          className={`form-field-short${errors.sucursal ? ' input-error' : ''}`}
                          style={{width: '100%', maxWidth: 260, height: '51px', padding: '0.9rem 1.2rem'}}
                        >
                          <option value="" style={{color: '#FFD700'}}>Selecciona una sucursal</option>
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
                            style={{accentColor: '#e53935'}}
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
                            style={{accentColor: '#e53935'}}
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
                        style={{accentColor: '#e53935', width: 18, height: 18, margin: 0}}
                      />
                    <label htmlFor="aceptaBeneficios" style={{margin: 0, color: '#e53935', fontWeight: 500, fontSize: '1rem', cursor: 'pointer'}}>
                      Quiero recibir novedades y beneficios exclusivos
                    </label>
                  </div>
                  <div>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e53935',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '0.98rem',
                        marginTop: 4
                      }}
                      onClick={() => setShowPrivacidad(true)}
                    >
                      Ver políticas de privacidad
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Modal de Privacidad - Movido fuera de la estructura principal */}
                  {showPrivacidad && (
        <div 
          style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 999999,
                      display: 'flex',
                      alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out',
            overflow: 'hidden'
          }}
          onClick={() => setShowPrivacidad(false)}
        >
          <div 
            className="modal-content"
            style={{
              background: '#181818',
                        color: '#fff',
              borderRadius: 20,
              maxWidth: 520,
                        width: '90%',
              padding: '2.5rem',
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.22)',
                        position: 'relative',
              margin: 'auto',
              border: '1.5px solid #e53935',
              maxHeight: '90vh',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: '#e53935 #181818',
              zIndex: 1000000
            }}
            onClick={(e) => e.stopPropagation()}
          >
                        <button
                          onClick={() => setShowPrivacidad(false)}
                          style={{
                            position: 'absolute',
                top: 16,
                            right: 16,
                background: 'rgba(255,215,0,0.1)',
                            border: 'none',
                            color: '#e53935',
                fontSize: 24,
                            cursor: 'pointer',
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 1
                          }}
                          aria-label="Cerrar"
                        >
                          ×
                        </button>
            <h2 style={{ 
              color: '#e53935', 
              marginBottom: 24, 
              fontSize: '1.5rem', 
              paddingRight: 24,
              fontWeight: 700,
              textAlign: 'center'
            }}>
              Política de Privacidad y Legales
            </h2>
            <div style={{ 
              fontSize: '1rem', 
              lineHeight: 1.6, 
              maxHeight: 'calc(90vh - 140px)', 
              overflowY: 'auto',
              paddingRight: 12,
              scrollbarWidth: 'thin',
              scrollbarColor: '#e53935 #181818'
            }}>
              <div className="modal-section">
                <p className="modal-text">
                  En <b>Mi Gusto Lovers</b> valoramos tu privacidad. Los datos que recolectamos (nombre, email, teléfono, cumpleaños, sabores favoritos, etc.) se utilizan únicamente para gestionar tu membresía, enviarte novedades y mejorar nuestros servicios.
                </p>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">¿Qué datos recolectamos?</h3>
                <p className="modal-text">
                  Solo los que tú nos proporcionas voluntariamente en el formulario de registro.
                          </p>
                        </div>

              <div className="modal-section">
                <h3 className="modal-section-title">¿Para qué usamos tus datos?</h3>
                <p className="modal-text">
                  Para enviarte novedades, promociones, beneficios exclusivos y mejorar tu experiencia como miembro.
                </p>
                      </div>

              <div className="modal-section">
                <h3 className="modal-section-title">¿Con quién compartimos tus datos?</h3>
                <p className="modal-text">
                  No compartimos tu información con terceros, salvo obligación legal.
                </p>
                    </div>

              <div className="modal-section">
                <h3 className="modal-section-title">¿Cómo protegemos tus datos?</h3>
                <p className="modal-text">
                  Aplicamos medidas de seguridad técnicas y organizativas para proteger tu información.
                </p>
                </div>

              <div className="modal-section">
                <h3 className="modal-section-title">¿Cuáles son tus derechos?</h3>
                <p className="modal-text">
                  Puedes solicitar la modificación o eliminación de tus datos en cualquier momento escribiendo a{' '}
                  <a href="mailto:contacto@migusto.com.ar" className="modal-link">
                    contacto@migusto.com.ar
                  </a>
                </p>
          </div>

              <div className="modal-section">
                <p className="modal-text" style={{ color: '#e53935', fontSize: '0.95rem', fontWeight: 500 }}>
                  Al registrarte, aceptas nuestra política de privacidad y el uso de tus datos según lo aquí expuesto.
                </p>
        </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;