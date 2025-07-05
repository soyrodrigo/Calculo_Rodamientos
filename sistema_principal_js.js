/**
 * 🏭 SISTEMA PRINCIPAL PLAMPH° - LÓGICA MODULARIZADA
 * ================================================
 * 
 * Contiene toda la lógica de cálculos, datos y funcionalidades
 * del sistema de análisis de componentes mecánicos.
 * 
 * SEPARADO DEL HTML PARA MEJOR MANTENIMIENTO
 * 
 * Versión: 2.0 Modular
 * Fecha: 2025
 */

class SistemaPLAMPH {
    constructor() {
        // Configuración inicial
        this.fabricanteGlobal = "NSK";
        this.componentesDataOriginal = null;
        this.configuracionGuardada = null;
        this.autoGuardado = true;
        
        // Control de gráficas
        this.chartInstances = {
            criticidad: null,
            costos: null,
            tiempo: null,
            categoria: null
        };
        this.graficasGeneradas = false;
        
        // Control de calendario
        this.calendario = null;
        this.eventosCalendario = [];
        
        // Inicializar datos
        this.inicializarDatos();
        this.inicializarEventos();
    }

    /**
     * Inicializar datos del sistema
     */
    inicializarDatos() {
        // Datos de componentes basados en la Hoja1 del Excel
        this.componentesData = [
            // RUEDAS (Alta carga - separadas específicamente)
            {id: 1, tipo: "6206 2RS", categoria: "Ruedas", cantidad: 4, aplicacion: "Ruedas Sistema Apilado", 
             rpm: 300, carga: 0.9, horas_diarias: 8, criticidad: 3, grupo: "RUEDAS", marca: "NSK"},
            {id: 2, tipo: "6206 RS", categoria: "Ruedas", cantidad: 4, aplicacion: "Ruedas Carro Material", 
             rpm: 250, carga: 0.9, horas_diarias: 6, criticidad: 3, grupo: "RUEDAS", marca: "NSK"},
             
            // SISTEMA DE EXTRACCIÓN
            {id: 3, tipo: "6203 42RS", categoria: "Rodamiento", cantidad: 20, aplicacion: "Sistema Extracción Pallets", 
             rpm: 1200, carga: 0.6, horas_diarias: 8, criticidad: 2, grupo: "EXTRACCIÓN", marca: "NSK"},
            {id: 4, tipo: "6205 RS", categoria: "Rodamiento", cantidad: 2, aplicacion: "Sistema Extracción Pallets", 
             rpm: 800, carga: 0.6, horas_diarias: 8, criticidad: 2, grupo: "EXTRACCIÓN", marca: "NSK"},
             
            // SISTEMA DE APILADO
            {id: 5, tipo: "6205 RS", categoria: "Rodamiento", cantidad: 4, aplicacion: "Sistema Apilado Pallets", 
             rpm: 600, carga: 0.5, horas_diarias: 8, criticidad: 2, grupo: "APILADO", marca: "NSK"},
            {id: 6, tipo: "6204 RS", categoria: "Rodamiento", cantidad: 8, aplicacion: "Sistema Apilado Pallets", 
             rpm: 500, carga: 0.5, horas_diarias: 8, criticidad: 2, grupo: "APILADO", marca: "NSK"},
             
            // CARROS Y MANIVELAS
            {id: 7, tipo: "6205 2RS", categoria: "Rodamiento", cantidad: 6, aplicacion: "Carro Material", 
             rpm: 200, carga: 0.4, horas_diarias: 4, criticidad: 1, grupo: "CARROS", marca: "NSK"},
            {id: 8, tipo: "6205 2RS", categoria: "Rodamiento", cantidad: 4, aplicacion: "Manivelas Carro", 
             rpm: 150, carga: 0.3, horas_diarias: 2, criticidad: 1, grupo: "CARROS", marca: "NSK"},
            {id: 9, tipo: "6304 2RS", categoria: "Rodamiento", cantidad: 2, aplicacion: "Laterales Carro", 
             rpm: 100, carga: 0.3, horas_diarias: 4, criticidad: 1, grupo: "CARROS", marca: "NSK"},
            {id: 10, tipo: "6207 RZ", categoria: "Rodamiento", cantidad: 2, aplicacion: "Disco Agitado Carro", 
             rpm: 1500, carga: 0.8, horas_diarias: 6, criticidad: 3, grupo: "CARROS", marca: "NSK"},
            {id: 11, tipo: "6204 RS", categoria: "Rodamiento", cantidad: 48, aplicacion: "Carros Transporte TRUPER", 
             rpm: 180, carga: 0.5, horas_diarias: 6, criticidad: 2, grupo: "CARROS", marca: "NSK"},
             
            // CINTA TRANSPORTADORA
            {id: 12, tipo: "6304 RS", categoria: "Rodamiento", cantidad: 6, aplicacion: "Cinta Pequeña Alimentación", 
             rpm: 800, carga: 0.3, horas_diarias: 8, criticidad: 1, grupo: "CINTA", marca: "NSK"},
            {id: 13, tipo: "6304 RS", categoria: "Rodamiento", cantidad: 36, aplicacion: "Cinta Transportadora Material", 
             rpm: 1000, carga: 0.4, horas_diarias: 8, criticidad: 2, grupo: "CINTA", marca: "NSK"},
             
            // OTROS
            {id: 14, tipo: "6204", categoria: "Rodamiento", cantidad: 4, aplicacion: "Caja Pallets", 
             rpm: 100, carga: 0.5, horas_diarias: 2, criticidad: 1, grupo: "OTROS", marca: "NSK"},
             
            // CHUMACERAS
            {id: 15, tipo: "P205", categoria: "Chumacera", cantidad: 2, aplicacion: "Sistema Extracción", 
             rpm: 800, carga: 0.6, horas_diarias: 8, criticidad: 2, grupo: "CHUMACERAS", marca: "NSK"},
            {id: 16, tipo: "UCFL 206", categoria: "Chumacera", cantidad: 2, aplicacion: "Sistema Extracción", 
             rpm: 1000, carga: 0.6, horas_diarias: 8, criticidad: 2, grupo: "CHUMACERAS", marca: "NSK"},
            {id: 17, tipo: "UCFL 205", categoria: "Chumacera", cantidad: 2, aplicacion: "Cepillo Redondo", 
             rpm: 1200, carga: 0.5, horas_diarias: 6, criticidad: 2, grupo: "CHUMACERAS", marca: "NSK"},
            {id: 18, tipo: "207 306", categoria: "Chumacera", cantidad: 4, aplicacion: "Sistema Apilado", 
             rpm: 600, carga: 0.6, horas_diarias: 8, criticidad: 2, grupo: "CHUMACERAS", marca: "NSK"},
            {id: 19, tipo: "F206", categoria: "Chumacera", cantidad: 6, aplicacion: "Carro Material", 
             rpm: 300, carga: 0.5, horas_diarias: 4, criticidad: 1, grupo: "CHUMACERAS", marca: "NSK"},
            {id: 20, tipo: "P207", categoria: "Chumacera", cantidad: 4, aplicacion: "Rodillos Alimentación", 
             rpm: 500, carga: 0.3, horas_diarias: 8, criticidad: 1, grupo: "CHUMACERAS", marca: "NSK"},
            {id: 21, tipo: "P206", categoria: "Chumacera", cantidad: 4, aplicacion: "Rodillos Cinta Transportadora", 
             rpm: 800, carga: 0.4, horas_diarias: 8, criticidad: 2, grupo: "CHUMACERAS", marca: "NSK"},
             
            // CORREAS
            {id: 22, tipo: "B 1350 Li", categoria: "Correa", cantidad: 2, aplicacion: "Disco Agitado Carro", 
             rpm: 0, carga: 0.6, horas_diarias: 6, criticidad: 2, grupo: "CORREAS", marca: "NSK"},
            {id: 23, tipo: "B2100 Li", categoria: "Correa", cantidad: 4, aplicacion: "Sistema de Vibración", 
             rpm: 0, carga: 0.7, horas_diarias: 4, criticidad: 2, grupo: "CORREAS", marca: "NSK"},
            {id: 24, tipo: "B116 (295Li)", categoria: "Correa", cantidad: 2, aplicacion: "Transmisión Cinta Transportadora", 
             rpm: 0, carga: 0.5, horas_diarias: 8, criticidad: 2, grupo: "CORREAS", marca: "NSK"},
            {id: 25, tipo: "B2000 Li", categoria: "Correa", cantidad: 2, aplicacion: "Transmisión Cinta Transportadora", 
             rpm: 0, carga: 0.5, horas_diarias: 8, criticidad: 2, grupo: "CORREAS", marca: "NSK"},
            {id: 26, tipo: "B 1650 Li", categoria: "Correa", cantidad: 3, aplicacion: "Mixer de Material", 
             rpm: 0, carga: 0.8, horas_diarias: 6, criticidad: 3, grupo: "CORREAS", marca: "NSK"}
        ];

        // Guardar copia original
        this.componentesDataOriginal = JSON.parse(JSON.stringify(this.componentesData));

        // Precios por fabricante en bolivianos (BOB)
        this.preciosFabricantes = {
            "SKF": {
                "6203": 85, "6204": 110, "6205": 135, "6206": 185, "6207": 260, "6304": 165,
                "P205": 320, "P206": 390, "P207": 460, "UCFL 205": 350, "UCFL 206": 420, "F206": 340, "207 306": 490,
                "B 1350": 180, "B2100": 220, "B116": 150, "B2000": 210, "B 1650": 195
            },
            "FAG": {
                "6203": 90, "6204": 115, "6205": 140, "6206": 195, "6207": 275, "6304": 175,
                "P205": 335, "P206": 410, "P207": 485, "UCFL 205": 365, "UCFL 206": 440, "F206": 355, "207 306": 510,
                "B 1350": 185, "B2100": 225, "B116": 155, "B2000": 215, "B 1650": 200
            },
            "NSK": {
                "6203": 80, "6204": 105, "6205": 130, "6206": 175, "6207": 245, "6304": 155,
                "P205": 305, "P206": 370, "P207": 435, "UCFL 205": 330, "UCFL 206": 400, "F206": 320, "207 306": 465,
                "B 1350": 170, "B2100": 210, "B116": 140, "B2000": 200, "B 1650": 185
            },
            "NTN": {
                "6203": 78, "6204": 102, "6205": 125, "6206": 170, "6207": 240, "6304": 150,
                "P205": 295, "P206": 360, "P207": 425, "UCFL 205": 320, "UCFL 206": 390, "F206": 310, "207 306": 450,
                "B 1350": 165, "B2100": 205, "B116": 135, "B2000": 195, "B 1650": 180
            },
            "TIMKEN": {
                "6203": 95, "6204": 125, "6205": 155, "6206": 210, "6207": 295, "6304": 190,
                "P205": 365, "P206": 445, "P207": 525, "UCFL 205": 395, "UCFL 206": 475, "F206": 385, "207 306": 550,
                "B 1350": 195, "B2100": 240, "B116": 165, "B2000": 230, "B 1650": 210
            },
            "KOYO": {
                "6203": 75, "6204": 98, "6205": 120, "6206": 165, "6207": 230, "6304": 145,
                "P205": 285, "P206": 350, "P207": 415, "UCFL 205": 310, "UCFL 206": 380, "F206": 300, "207 306": 440,
                "B 1350": 160, "B2100": 200, "B116": 130, "B2000": 190, "B 1650": 175
            },
            "GENERICO": {
                "6203": 65, "6204": 85, "6205": 105, "6206": 145, "6207": 200, "6304": 125,
                "P205": 250, "P206": 305, "P207": 360, "UCFL 205": 270, "UCFL 206": 330, "F206": 260, "207 306": 385,
                "B 1350": 130, "B2100": 160, "B116": 110, "B2000": 150, "B 1650": 140
            },
            "GATES": {
                "6203": 80, "6204": 105, "6205": 130, "6206": 175, "6207": 245, "6304": 155,
                "P205": 305, "P206": 370, "P207": 435, "UCFL 205": 330, "UCFL 206": 400, "F206": 320, "207 306": 465,
                "B 1350": 220, "B2100": 280, "B116": 180, "B2000": 260, "B 1650": 240
            },
            "OPTIBELT": {
                "6203": 80, "6204": 105, "6205": 130, "6206": 175, "6207": 245, "6304": 155,
                "P205": 305, "P206": 370, "P207": 435, "UCFL 205": 330, "UCFL 206": 400, "F206": 320, "207 306": 465,
                "B 1350": 200, "B2100": 250, "B116": 160, "B2000": 230, "B 1650": 210
            },
            "CONTINENTAL": {
                "6203": 80, "6204": 105, "6205": 130, "6206": 175, "6207": 245, "6304": 155,
                "P205": 305, "P206": 370, "P207": 435, "UCFL 205": 330, "UCFL 206": 400, "F206": 320, "207 306": 465,
                "B 1350": 210, "B2100": 265, "B116": 170, "B2000": 245, "B 1650": 225
            }
        };

        // Cargas estimadas por fabricante
        this.cargasEstimadas = {
            "SKF": {
                "6203": 0.8, "6204": 0.7, "6205": 0.6, "6206": 0.9, "6207": 0.8, "6304": 0.5,
                "P205": 0.6, "P206": 0.7, "P207": 0.5, "UCFL 205": 0.5, "UCFL 206": 0.6, "F206": 0.5, "207 306": 0.6,
                "correa": 0.6
            },
            "FAG": {
                "6203": 0.7, "6204": 0.6, "6205": 0.5, "6206": 0.8, "6207": 0.7, "6304": 0.4,
                "P205": 0.5, "P206": 0.6, "P207": 0.4, "UCFL 205": 0.4, "UCFL 206": 0.5, "F206": 0.4, "207 306": 0.5,
                "correa": 0.5
            },
            "NSK": {
                "6203": 0.6, "6204": 0.5, "6205": 0.5, "6206": 0.9, "6207": 0.8, "6304": 0.4,
                "P205": 0.6, "P206": 0.4, "P207": 0.3, "UCFL 205": 0.5, "UCFL 206": 0.6, "F206": 0.5, "207 306": 0.6,
                "correa": 0.6
            },
            "NTN": {
                "6203": 0.6, "6204": 0.5, "6205": 0.5, "6206": 0.9, "6207": 0.8, "6304": 0.4,
                "P205": 0.6, "P206": 0.4, "P207": 0.3, "UCFL 205": 0.5, "UCFL 206": 0.6, "F206": 0.5, "207 306": 0.6,
                "correa": 0.6
            },
            "TIMKEN": {
                "6203": 0.9, "6204": 0.8, "6205": 0.7, "6206": 1.0, "6207": 0.9, "6304": 0.6,
                "P205": 0.7, "P206": 0.8, "P207": 0.6, "UCFL 205": 0.6, "UCFL 206": 0.7, "F206": 0.6, "207 306": 0.7,
                "correa": 0.7
            },
            "KOYO": {
                "6203": 0.5, "6204": 0.4, "6205": 0.4, "6206": 0.8, "6207": 0.7, "6304": 0.3,
                "P205": 0.5, "P206": 0.3, "P207": 0.2, "UCFL 205": 0.4, "UCFL 206": 0.5, "F206": 0.4, "207 306": 0.5,
                "correa": 0.5
            },
            "GENERICO": {
                "6203": 0.4, "6204": 0.3, "6205": 0.3, "6206": 0.7, "6207": 0.6, "6304": 0.2,
                "P205": 0.4, "P206": 0.2, "P207": 0.1, "UCFL 205": 0.3, "UCFL 206": 0.4, "F206": 0.3, "207 306": 0.4,
                "correa": 0.4
            },
            "GATES": {
                "6203": 0.6, "6204": 0.5, "6205": 0.5, "6206": 0.9, "6207": 0.8, "6304": 0.4,
                "P205": 0.6, "P206": 0.4, "P207": 0.3, "UCFL 205": 0.5, "UCFL 206": 0.6, "F206": 0.5, "207 306": 0.6,
                "correa": 0.7
            },
            "OPTIBELT": {
                "6203": 0.6, "6204": 0.5, "6205": 0.5, "6206": 0.9, "6207": 0.8, "6304": 0.4,
                "P205": 0.6, "P206": 0.4, "P207": 0.3, "UCFL 205": 0.5, "UCFL 206": 0.6, "F206": 0.5, "207 306": 0.6,
                "correa": 0.65
            },
            "CONTINENTAL": {
                "6203": 0.6, "6204": 0.5, "6205": 0.5, "6206": 0.9, "6207": 0.8, "6304": 0.4,
                "P205": 0.6, "P206": 0.4, "P207": 0.3, "UCFL 205": 0.5, "UCFL 206": 0.6, "F206": 0.5, "207 306": 0.6,
                "correa": 0.68
            }
        };

        // Capacidades de carga dinámica (kN) por marca
        this.capacidadesCargaMarca = {
            "SKF": {
                "6203": 9.8, "6204": 13.2, "6205": 14.5, "6206": 20.1, "6207": 26.0, "6304": 15.8,
                "P205": 28.5, "P206": 35.2, "P207": 42.8, "UCFL 205": 25.6, "UCFL 206": 31.4, "F206": 22.8, "207 306": 38.5
            },
            "FAG": {
                "6203": 9.6, "6204": 12.9, "6205": 14.2, "6206": 19.8, "6207": 25.7, "6304": 15.5,
                "P205": 28.0, "P206": 34.8, "P207": 42.2, "UCFL 205": 25.2, "UCFL 206": 31.0, "F206": 22.5, "207 306": 38.0
            },
            "NSK": {
                "6203": 9.5, "6204": 12.7, "6205": 14.0, "6206": 19.5, "6207": 25.5, "6304": 15.3,
                "P205": 27.8, "P206": 34.5, "P207": 41.8, "UCFL 205": 25.0, "UCFL 206": 30.8, "F206": 22.2, "207 306": 37.5
            },
            "NTN": {
                "6203": 9.4, "6204": 12.6, "6205": 13.9, "6206": 19.3, "6207": 25.2, "6304": 15.1,
                "P205": 27.5, "P206": 34.2, "P207": 41.5, "UCFL 205": 24.8, "UCFL 206": 30.5, "F206": 22.0, "207 306": 37.2
            },
            "TIMKEN": {
                "6203": 10.2, "6204": 13.8, "6205": 15.0, "6206": 20.8, "6207": 27.2, "6304": 16.5,
                "P205": 29.5, "P206": 36.8, "P207": 44.5, "UCFL 205": 26.8, "UCFL 206": 32.5, "F206": 24.2, "207 306": 40.2
            },
            "KOYO": {
                "6203": 9.2, "6204": 12.3, "6205": 13.6, "6206": 18.8, "6207": 24.5, "6304": 14.8,
                "P205": 26.8, "P206": 33.2, "P207": 40.2, "UCFL 205": 24.2, "UCFL 206": 29.8, "F206": 21.5, "207 306": 36.2
            },
            "GENERICO": {
                "6203": 8.8, "6204": 11.8, "6205": 12.9, "6206": 17.8, "6207": 23.2, "6304": 14.2,
                "P205": 25.5, "P206": 31.8, "P207": 38.5, "UCFL 205": 23.2, "UCFL 206": 28.5, "F206": 20.8, "207 306": 34.8
            },
            "GATES": {
                "6203": 9.5, "6204": 12.7, "6205": 14.0, "6206": 19.5, "6207": 25.5, "6304": 15.3,
                "P205": 27.8, "P206": 34.5, "P207": 41.8, "UCFL 205": 25.0, "UCFL 206": 30.8, "F206": 22.2, "207 306": 37.5
            },
            "OPTIBELT": {
                "6203": 9.5, "6204": 12.7, "6205": 14.0, "6206": 19.5, "6207": 25.5, "6304": 15.3,
                "P205": 27.8, "P206": 34.5, "P207": 41.8, "UCFL 205": 25.0, "UCFL 206": 30.8, "F206": 22.2, "207 306": 37.5
            },
            "CONTINENTAL": {
                "6203": 9.5, "6204": 12.7, "6205": 14.0, "6206": 19.5, "6207": 25.5, "6304": 15.3,
                "P205": 27.8, "P206": 34.5, "P207": 41.8, "UCFL 205": 25.0, "UCFL 206": 30.8, "F206": 22.2, "207 306": 37.5
            }
        };

        // Vida base de correas por fabricante (en meses)
        this.vidaBaseCorreasFabricante = {
            "GENERICO": 18,
            "GATES": 24,
            "OPTIBELT": 20, 
            "CONTINENTAL": 22,
            "NSK": 18,
            "KOYO": 18,
            "NTN": 18,
            "FAG": 18,
            "SKF": 18,
            "TIMKEN": 18
        };

        // Exponer datos globalmente para compatibilidad
        window.componentesData = this.componentesData;
        window.obtenerPrecio = this.obtenerPrecio.bind(this);
        window.mostrarMensaje = this.mostrarMensaje.bind(this);
    }

    /**
     * Inicializar eventos y listeners
     */
    inicializarEventos() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.configurarEventos());
        } else {
            this.configurarEventos();
        }
    }

    /**
     * Configurar todos los event listeners
     */
    configurarEventos() {
        // Auto-guardado en campos de configuración
        const campos = ['diasSemana', 'semanasAno', 'factorAmbiente', 'margenSeguridad', 'fechaInicio'];
        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) {
                elemento.addEventListener('change', () => this.autoGuardar());
            }
        });

        // Cargar configuración automáticamente
        setTimeout(() => {
            this.cargarConfiguracionInicial();
        }, 500);
    }

    /**
     * Cargar configuración inicial
     */
    cargarConfiguracionInicial() {
        this.llenarTablaConfiguracion();
        
        if (this.localStorageDisponible()) {
            const configGuardada = localStorage.getItem('rodamientos_config');
            if (configGuardada) {
                try {
                    const config = JSON.parse(configGuardada);
                    this.aplicarConfiguracionCargada(config);
                    this.mostrarMensaje('🔄 Configuración anterior cargada automáticamente', 'success');
                } catch(e) {
                    this.calcularTodo();
                }
            } else {
                this.calcularTodo();
            }
            this.actualizarInfoGuardado();
        } else {
            this.calcularTodo();
            this.mostrarMensaje('⚠️ Guardado automático no disponible en este entorno', 'warning');
        }
    }

    /**
     * FUNCIONES DE CÁLCULO
     */

    obtenerCapacidadCarga(tipo, marca = "NSK") {
        const codigo = tipo.split(' ')[0];
        
        if (this.capacidadesCargaMarca[marca] && this.capacidadesCargaMarca[marca][codigo]) {
            return this.capacidadesCargaMarca[marca][codigo];
        }
        
        const capacidadesEstandar = {
            "6203": 9.5, "6204": 12.7, "6205": 14.0, 
            "6206": 19.5, "6207": 25.5, "6304": 15.3
        };
        
        return capacidadesEstandar[codigo] || 15.0;
    }

    obtenerCapacidadCargaParaMostrar(tipo, marca) {
        if (tipo.includes('Correa') || tipo.includes('B ') || tipo.includes('B1') || tipo.includes('B2') || tipo.includes('Li')) {
            return "N/A";
        }
        
        const codigo = tipo.split(' ')[0];
        
        if (this.capacidadesCargaMarca[marca] && this.capacidadesCargaMarca[marca][codigo]) {
            return this.capacidadesCargaMarca[marca][codigo].toFixed(1);
        }
        
        const capacidadesEstandar = {
            "6203": 9.5, "6204": 12.7, "6205": 14.0, 
            "6206": 19.5, "6207": 25.5, "6304": 15.3
        };
        
        return (capacidadesEstandar[codigo] || 15.0).toFixed(1);
    }

    obtenerCargaEstimada(marca, tipo, categoria) {
        if (!this.cargasEstimadas[marca]) return 0.5;
        
        if (categoria === 'Correa') {
            return this.cargasEstimadas[marca]['correa'] || 0.5;
        }
        
        const codigo = tipo.split(' ')[0];
        return this.cargasEstimadas[marca][codigo] || 0.5;
    }

    calcularVidaUtil(capacidadCarga, cargaAplicada, rpm, factorAmbiente) {
        const P = cargaAplicada * capacidadCarga;
        const L10_revoluciones = Math.pow(capacidadCarga / P, 3) * 1000000;
        const L10_horas = (L10_revoluciones / (rpm * 60)) * factorAmbiente;
        return Math.max(100, Math.round(L10_horas));
    }

    calcularVidaUtilChumacera(carga, rpm, factorAmbiente) {
        const vidaBase = 15000;
        const factorCarga = Math.max(0.2, 2 - carga);
        const factorVelocidad = Math.max(0.5, 1 - (rpm / 2000));
        return Math.max(500, Math.round(vidaBase * factorAmbiente * factorCarga * factorVelocidad));
    }
    
    calcularVidaUtilCorrea(carga, horas_diarias, factorAmbiente, marca = "NSK") {
        const vidaBaseMeses = this.vidaBaseCorreasFabricante[marca] || 18;
        const factorCarga = Math.max(0.3, 2 - carga);
        const factorUso = Math.max(0.3, 1 - (horas_diarias / 24));
        const vidaUtilMeses = vidaBaseMeses * factorAmbiente * factorCarga * factorUso;
        return Math.max(3, Math.round(vidaUtilMeses));
    }

    obtenerPrecio(tipo, categoria, marca) {
        const precios = this.preciosFabricantes[marca] || this.preciosFabricantes["NSK"];
        
        if (categoria === 'Rodamiento' || categoria === 'Ruedas') {
            const codigo = tipo.split(' ')[0];
            return precios[codigo] || 120;
        } else if (categoria === 'Correa') {
            const codigo = tipo.split(' ')[0] + (tipo.includes('Li') ? '' : '');
            return precios[codigo] || 150;
        } else {
            // Chumaceras
            for (let key in precios) {
                if (tipo.includes(key)) {
                    return precios[key];
                }
            }
            return 350;
        }
    }

    /**
     * FUNCIÓN PRINCIPAL DE CÁLCULO
     */
    calcularTodo() {
        const diasSemana = parseInt(document.getElementById('diasSemana')?.value || 5);
        const semanasAno = parseInt(document.getElementById('semanasAno')?.value || 50);
        const factorAmbiente = parseFloat(document.getElementById('factorAmbiente')?.value || 0.8);
        const margenSeguridad = parseFloat(document.getElementById('margenSeguridad')?.value || 1.5);

        let totalCriticos = 0;
        let presupuestoTotal = 0;
        let tiemposRecambio = [];
        let totalComponentes = 0;

        this.componentesData.forEach((item, index) => {
            const horasAnuales = item.horas_diarias * diasSemana * semanasAno;
            let vidaUtil;
            let tiempoRecambioMeses;
            
            if (item.categoria === 'Rodamiento' || item.categoria === 'Ruedas') {
                const capacidadCarga = this.obtenerCapacidadCarga(item.tipo, item.marca);
                vidaUtil = this.calcularVidaUtil(capacidadCarga, item.carga, item.rpm, factorAmbiente);
                tiempoRecambioMeses = Math.max(1, Math.round((vidaUtil / horasAnuales) * 12));
            } else if (item.categoria === 'Correa') {
                tiempoRecambioMeses = this.calcularVidaUtilCorrea(item.carga, item.horas_diarias, factorAmbiente, item.marca);
                vidaUtil = (tiempoRecambioMeses / 12) * horasAnuales;
            } else { // Chumacera
                vidaUtil = this.calcularVidaUtilChumacera(item.carga, item.rpm, factorAmbiente);
                tiempoRecambioMeses = Math.max(1, Math.round((vidaUtil / horasAnuales) * 12));
            }

            // Ajustar por criticidad
            const factorCriticidad = [1.0, 0.8, 0.6, 0.4][item.criticidad];
            tiempoRecambioMeses = Math.max(1, Math.round(tiempoRecambioMeses * factorCriticidad));
            
            const precio = item.precio_custom || this.obtenerPrecio(item.tipo, item.categoria, item.marca);
            
            // Calcular reemplazos anuales
            let reemplazosAno;
            if (tiempoRecambioMeses >= 12) {
                reemplazosAno = Math.ceil(item.cantidad * margenSeguridad);
            } else {
                reemplazosAno = Math.ceil((12 / tiempoRecambioMeses) * item.cantidad * margenSeguridad);
            }
            
            tiemposRecambio.push(tiempoRecambioMeses);
            presupuestoTotal += reemplazosAno * precio;
            totalComponentes += item.cantidad;
            
            if (tiempoRecambioMeses < 6) totalCriticos++;
            
            const elemento = document.getElementById(`tiempo-${index}`);
            if (elemento) {
                elemento.textContent = `${tiempoRecambioMeses} meses`;
                elemento.style.color = tiempoRecambioMeses < 6 ? '#d32f2f' : 
                                      tiempoRecambioMeses < 12 ? '#ff9800' : '#1e3c72';
            }
        });

        const tiempoPromedio = tiemposRecambio.length > 0 ? 
            Math.round(tiemposRecambio.reduce((a, b) => a + b, 0) / tiemposRecambio.length) : 0;

        // Actualizar UI
        const elementos = {
            'componentesCriticos': totalCriticos,
            'presupuestoTotal': `Bs. ${presupuestoTotal.toLocaleString()}`,
            'tiempoPromedio': tiempoPromedio,
            'totalComponentes': totalComponentes
        };

        Object.entries(elementos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.textContent = valor;
        });

        this.mostrarAlertas(totalCriticos);
        this.mostrarAnalisisDetallado();
        this.mostrarPresupuestoDetallado(presupuestoTotal);
        
        // Actualizar gráficas si están visibles
        const graficasTab = document.getElementById('tab-graficas');
        if (graficasTab && graficasTab.classList.contains('active')) {
            this.graficasGeneradas = false;
            this.generarGraficas();
        }

        // Actualizar calendario si está visible
        const calendarioTab = document.getElementById('tab-calendario');
        if (calendarioTab && calendarioTab.classList.contains('active')) {
            this.calcularEventosCalendario();
        }
        
        const resultados = document.getElementById('resultados');
        if (resultados) resultados.style.display = 'block';
    }

    /**
     * FUNCIONES DE UI Y GESTIÓN
     */

    mostrarMensaje(texto, tipo = 'info') {
        const colores = {
            'info': '#2196f3',
            'success': '#4caf50', 
            'warning': '#ff9800',
            'error': '#f44336'
        };
        
        const mensaje = document.createElement('div');
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${colores[tipo] || colores.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        `;
        mensaje.textContent = texto;
        
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            if (document.body.contains(mensaje)) {
                mensaje.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => document.body.removeChild(mensaje), 300);
            }
        }, 4000);
    }

    localStorageDisponible() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }

    autoGuardar() {
        if (this.autoGuardado && this.localStorageDisponible()) {
            setTimeout(() => {
                this.guardarConfiguracion();
            }, 1000);
        }
    }

    guardarConfiguracion() {
        if (!this.localStorageDisponible()) {
            this.mostrarMensaje('⚠️ Guardado no disponible en este entorno', 'warning');
            return;
        }

        const configuracion = {
            componentesData: JSON.parse(JSON.stringify(this.componentesData)),
            fabricanteGlobal: this.fabricanteGlobal,
            diasSemana: document.getElementById('diasSemana')?.value || 5,
            semanasAno: document.getElementById('semanasAno')?.value || 50,
            factorAmbiente: document.getElementById('factorAmbiente')?.value || 0.8,
            margenSeguridad: document.getElementById('margenSeguridad')?.value || 1.5,
            fechaInicio: document.getElementById('fechaInicio')?.value || "2025-01-01",
            fechaGuardado: new Date().toISOString(),
            version: "2.1"
        };

        try {
            localStorage.setItem('rodamientos_config', JSON.stringify(configuracion));
            this.configuracionGuardada = configuracion;
            this.actualizarInfoGuardado();
            this.mostrarMensaje('✅ Configuración guardada correctamente', 'success');
        } catch(e) {
            this.mostrarMensaje('❌ Error al guardar configuración', 'warning');
        }
    }

    cargarConfiguracion() {
        if (!this.localStorageDisponible()) {
            this.mostrarMensaje('⚠️ Carga no disponible en este entorno', 'warning');
            return;
        }

        try {
            const configGuardada = localStorage.getItem('rodamientos_config');
            if (configGuardada) {
                const config = JSON.parse(configGuardada);
                this.aplicarConfiguracionCargada(config);
                this.mostrarMensaje('✅ Configuración cargada correctamente', 'success');
            } else {
                this.mostrarMensaje('ℹ️ No hay configuración guardada', 'warning');
            }
        } catch(e) {
            this.mostrarMensaje('❌ Error al cargar configuración', 'warning');
        }
    }

    aplicarConfiguracionCargada(config) {
        // Restaurar datos de componentes
        this.componentesData.splice(0, this.componentesData.length, ...config.componentesData);
        
        // Restaurar configuración global
        this.fabricanteGlobal = config.fabricanteGlobal || "NSK";
        
        const elementos = {
            'fabricanteGlobal': this.fabricanteGlobal,
            'diasSemana': config.diasSemana || 5,
            'semanasAno': config.semanasAno || 50,
            'factorAmbiente': config.factorAmbiente || 0.8,
            'margenSeguridad': config.margenSeguridad || 1.5,
            'fechaInicio': config.fechaInicio || "2025-01-01"
        };

        Object.entries(elementos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.value = valor;
        });
        
        this.configuracionGuardada = config;
        
        // Actualizar interfaces
        this.llenarTablaConfiguracion();
        this.calcularTodo();
        this.actualizarInfoGuardado();
    }

    actualizarInfoGuardado() {
        const infoDiv = document.getElementById('infoGuardado');
        const fechaSpan = document.getElementById('fechaGuardado');
        const configSpan = document.getElementById('configDisponibles');
        
        if (this.configuracionGuardada && this.configuracionGuardada.fechaGuardado) {
            const fecha = new Date(this.configuracionGuardada.fechaGuardado);
            if (fechaSpan) fechaSpan.textContent = fecha.toLocaleString('es-ES');
            if (configSpan) configSpan.textContent = "1";
            if (infoDiv) infoDiv.style.display = 'block';
        } else {
            if (fechaSpan) fechaSpan.textContent = "Nunca";
            if (configSpan) configSpan.textContent = "0";
            if (infoDiv) infoDiv.style.display = 'block';
        }
    }

    llenarTablaConfiguracion() {
        const tbody = document.querySelector('#tablaConfiguracion tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        let grupoActual = '';
        
        this.componentesData.forEach((item, index) => {
            if (item.grupo !== grupoActual) {
                grupoActual = item.grupo;
                const grupoRow = tbody.insertRow();
                grupoRow.className = 'grupo-header';
                grupoRow.innerHTML = `<td colspan="10"><strong>📁 ${grupoActual}</strong></td>`;
            }
            
            const precio = item.precio_custom || this.obtenerPrecio(item.tipo, item.categoria, item.marca);
            const criticidadTexto = ['🟢 Bajo', '🟡 Medio', '🟠 Alto', '🔴 Crítico'][item.criticidad];
            const cargaEstimada = this.obtenerCargaEstimada(item.marca, item.tipo, item.categoria);
            const capacidadkN = this.obtenerCapacidadCargaParaMostrar(item.tipo, item.marca);
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${item.tipo}</strong></td>
                <td><span style="color: #666; font-weight: bold;">${item.cantidad}</span></td>
                <td>${item.aplicacion}</td>
                <td><input class="editable-input" type="number" value="${item.rpm}" min="0" max="3000" onchange="sistemaPLAMPH.actualizarComponente(${index}, 'rpm', this.value)"></td>
                <td>
                    <div class="carga-info">
                        <input class="editable-input" type="number" value="${item.carga}" min="0.1" max="1.0" step="0.1" onchange="sistemaPLAMPH.actualizarComponente(${index}, 'carga', this.value)">
                        <span class="carga-estimada tooltip">${cargaEstimada.toFixed(1)}<span class="tooltiptext">Carga estimada para marca ${item.marca}</span></span>
                    </div>
                </td>
                <td><input class="editable-input" type="number" value="${item.horas_diarias}" min="1" max="24" onchange="sistemaPLAMPH.actualizarComponente(${index}, 'horas_diarias', this.value)"></td>
                <td>
                    <div class="criticidad-control">
                        <span id="criticidad-${index}">${criticidadTexto}</span>
                        <button class="criticidad-btn" style="background: #d32f2f;" onclick="sistemaPLAMPH.cambiarCriticidad(${index}, 1)">+</button>
                        <button class="criticidad-btn" style="background: #1e3c72;" onclick="sistemaPLAMPH.cambiarCriticidad(${index}, -1)">-</button>
                    </div>
                </td>
                <td>
                    <div class="marca-container">
                        <select class="editable-select" onchange="sistemaPLAMPH.actualizarMarca(${index}, this.value)">
                            <option value="GENERICO" ${item.marca === 'GENERICO' ? 'selected' : ''}>GENERICO</option>
                            <option value="KOYO" ${item.marca === 'KOYO' ? 'selected' : ''}>KOYO</option>
                            <option value="NTN" ${item.marca === 'NTN' ? 'selected' : ''}>NTN</option>
                            <option value="NSK" ${item.marca === 'NSK' ? 'selected' : ''}>NSK</option>
                            <option value="FAG" ${item.marca === 'FAG' ? 'selected' : ''}>FAG</option>
                            <option value="SKF" ${item.marca === 'SKF' ? 'selected' : ''}>SKF</option>
                            <option value="TIMKEN" ${item.marca === 'TIMKEN' ? 'selected' : ''}>TIMKEN</option>
                            <option value="GATES" ${item.marca === 'GATES' ? 'selected' : ''}>GATES</option>
                            <option value="OPTIBELT" ${item.marca === 'OPTIBELT' ? 'selected' : ''}>OPTIBELT</option>
                            <option value="CONTINENTAL" ${item.marca === 'CONTINENTAL' ? 'selected' : ''}>CONTINENTAL</option>
                        </select>
                        <span class="tooltip ${capacidadkN === "N/A" ? "capacidad-correa" : "capacidad-marca"}">
                            ${capacidadkN === "N/A" ? "CORREA" : capacidadkN + " kN"}
                            <span class="tooltiptext">${capacidadkN === "N/A" ? "Correa - No aplica capacidad kN" : "Capacidad de carga dinámica " + item.marca + ". Usa este valor para comparar con otras marcas disponibles"}</span>
                        </span>
                    </div>
                </td>
                <td><input class="precio-editable" type="number" value="${precio}" onchange="sistemaPLAMPH.actualizarPrecio(${index}, this.value)"></td>
                <td><span class="tiempo-recambio" id="tiempo-${index}">Calculando...</span></td>
            `;
        });
    }

    actualizarComponente(index, campo, valor) {
        this.componentesData[index][campo] = parseFloat(valor);
        this.autoGuardar();
    }

    actualizarMarca(index, marca) {
        this.componentesData[index].marca = marca;
        
        // Actualizar precio automáticamente
        const nuevoPrecio = this.obtenerPrecio(this.componentesData[index].tipo, this.componentesData[index].categoria, marca);
        const precioInput = document.querySelector(`#tablaConfiguracion tbody tr .precio-editable`);
        
        // Encontrar la fila correcta
        const filas = document.querySelectorAll('#tablaConfiguracion tbody tr');
        let filaIndex = 0;
        for (let i = 0; i < filas.length; i++) {
            if (!filas[i].classList.contains('grupo-header')) {
                if (filaIndex === index) {
                    const precioInput = filas[i].querySelector('.precio-editable');
                    if (precioInput) {
                        precioInput.value = nuevoPrecio;
                        delete this.componentesData[index].precio_custom;
                    }
                    break;
                }
                filaIndex++;
            }
        }
        
        // Actualizar carga estimada mostrada
        const cargaEstimada = this.obtenerCargaEstimada(marca, this.componentesData[index].tipo, this.componentesData[index].categoria);
        const cargaEstimadaSpan = document.querySelector(`#tablaConfiguracion tbody tr:nth-child(${index + 2}) .carga-estimada`);
        if (cargaEstimadaSpan) {
            cargaEstimadaSpan.textContent = cargaEstimada.toFixed(1);
        }
        
        this.autoGuardar();
    }

    actualizarPrecio(index, precio) {
        this.componentesData[index].precio_custom = parseFloat(precio);
        this.autoGuardar();
    }

    cambiarCriticidad(index, direccion) {
        this.componentesData[index].criticidad = Math.max(0, Math.min(3, this.componentesData[index].criticidad + direccion));
        const criticidadTexto = ['🟢 Bajo', '🟡 Medio', '🟠 Alto', '🔴 Crítico'][this.componentesData[index].criticidad];
        const elemento = document.getElementById(`criticidad-${index}`);
        if (elemento) elemento.textContent = criticidadTexto;
        this.autoGuardar();
    }

    mostrarAlertas(criticos) {
        const alertas = document.getElementById('alertasCriticas');
        if (!alertas) return;
        
        if (criticos > 0) {
            alertas.innerHTML = `
                <div class="warning">
                    <h4>⚠️ ${criticos} componentes requieren atención inmediata</h4>
                    <p>Estos componentes tienen un tiempo de recambio menor a 6 meses. Revisar urgentemente.</p>
                </div>`;
        } else {
            alertas.innerHTML = `
                <div class="success">
                    <h4>✅ Todos los componentes en buen estado</h4>
                    <p>No hay componentes que requieran atención inmediata.</p>
                </div>`;
        }
    }

    mostrarAnalisisDetallado() {
        const analisisDiv = document.getElementById('analisisDetallado');
        if (!analisisDiv) return;
        
        const grupos = {};
        this.componentesData.forEach(item => {
            if (!grupos[item.grupo]) grupos[item.grupo] = [];
            grupos[item.grupo].push(item);
        });

        let html = '';
        Object.keys(grupos).forEach(grupo => {
            const items = grupos[grupo];
            const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
            html += `
                <div class="card">
                    <h4>📁 ${grupo} (${totalItems} unidades)</h4>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr><th>Tipo</th><th>Cantidad</th><th>RPM</th><th>Carga</th><th>Marca</th><th>Capacidad kN</th><th>Criticidad</th></tr>
                            </thead>
                            <tbody>`;
            
            items.forEach(item => {
                const criticidadTexto = ['🟢 Bajo', '🟡 Medio', '🟠 Alto', '🔴 Crítico'][item.criticidad];
                const capacidadkN = this.obtenerCapacidadCargaParaMostrar(item.tipo, item.marca);
                html += `
                    <tr>
                        <td>${item.tipo}</td>
                        <td>${item.cantidad}</td>
                        <td>${item.rpm}</td>
                        <td>${item.carga}</td>
                        <td><strong>${item.marca}</strong></td>
                        <td><span style="color: #1e3c72; font-weight: bold;">${capacidadkN === "N/A" ? "CORREA" : capacidadkN + " kN"}</span></td>
                        <td>${criticidadTexto}</td>
                    </tr>`;
            });
            
            html += '</tbody></table></div></div>';
        });

        analisisDiv.innerHTML = html;
    }

    mostrarPresupuestoDetallado(total) {
        const presupuestoDiv = document.getElementById('presupuestoDetallado');
        if (!presupuestoDiv) return;
        
        // Análisis por marca
        const porMarca = {};
        this.componentesData.forEach(item => {
            if (!porMarca[item.marca]) porMarca[item.marca] = { cantidad: 0, costo: 0 };
            const precio = item.precio_custom || this.obtenerPrecio(item.tipo, item.categoria, item.marca);
            porMarca[item.marca].cantidad += item.cantidad;
            porMarca[item.marca].costo += precio * item.cantidad;
        });

        let tablaMarcas = `
            <div class="card">
                <h4>💰 Distribución de Costos por Marca</h4>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>Marca</th><th>Componentes</th><th>Costo Estimado</th><th>% del Total</th></tr>
                        </thead>
                        <tbody>`;
        
        Object.keys(porMarca).forEach(marca => {
            const datos = porMarca[marca];
            const porcentaje = total > 0 ? ((datos.costo / total) * 100).toFixed(1) : 0;
            tablaMarcas += `
                <tr>
                    <td><strong>${marca}</strong></td>
                    <td>${datos.cantidad} unidades</td>
                    <td>Bs. ${datos.costo.toLocaleString()}</td>
                    <td>${porcentaje}%</td>
                </tr>`;
        });
        
        tablaMarcas += '</tbody></table></div></div>';

        const html = `
            <div class="summary-grid">
                <div class="summary-card">
                    <h4>PRESUPUESTO BASE</h4>
                    <div class="value">Bs. ${total.toLocaleString()}</div>
                    <div class="unit">costo anual</div>
                </div>
                <div class="summary-card">
                    <h4>CON RESERVA 20%</h4>
                    <div class="value">Bs. ${Math.round(total * 1.2).toLocaleString()}</div>
                    <div class="unit">recomendado</div>
                </div>
                <div class="summary-card">
                    <h4>MARCAS DIFERENTES</h4>
                    <div class="value">${Object.keys(porMarca).length}</div>
                    <div class="unit">proveedores</div>
                </div>
            </div>
            ${tablaMarcas}
            <div class="success">
                <h4>💡 Recomendaciones PLAMPH°</h4>
                <ol>
                    <li>Presupuesto sugerido: <strong>Bs. ${Math.round(total * 1.2).toLocaleString()}</strong></li>
                    <li>Priorizar componentes con tiempo de recambio menor a 6 meses</li>
                    <li>Mantener stock de componentes críticos (ruedas y extracción)</li>
                    <li>Negociar con múltiples proveedores según disponibilidad</li>
                    <li><strong>Usar valores kN para comparar:</strong> Si no encuentras la marca exacta, busca una con capacidad de carga similar (±2 kN)</li>
                    <li>Considerar compras por volumen para reducir costos</li>
                    <li>Coordinar con distribuidores locales de Tupiza</li>
                </ol>
            </div>`;
        
        presupuestoDiv.innerHTML = html;
    }

    /**
     * FUNCIONES DE GRÁFICAS Y CALENDARIO
     */

    generarGraficas() {
        if (this.graficasGeneradas) return;
        
        setTimeout(() => {
            try {
                this.destruirGraficasExistentes();
                this.crearGraficas();
                this.graficasGeneradas = true;
            } catch (error) {
                console.log('Error generando gráficas:', error);
            }
        }, 100);
    }

    destruirGraficasExistentes() {
        Object.keys(this.chartInstances).forEach(key => {
            if (this.chartInstances[key]) {
                this.chartInstances[key].destroy();
                this.chartInstances[key] = null;
            }
        });
    }

    crearGraficas() {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            interaction: { intersect: false },
            plugins: { legend: { display: true, position: 'bottom' } }
        };

        this.crearGraficaCriticidad(baseOptions);
        this.crearGraficaCostos(baseOptions);
        this.crearGraficaTiempo(baseOptions);
        this.crearGraficaCategoria(baseOptions);
    }

    crearGraficaCriticidad(baseOptions) {
        const criticidadData = {};
        this.componentesData.forEach(item => {
            if (!criticidadData[item.grupo]) {
                criticidadData[item.grupo] = { bajo: 0, medio: 0, alto: 0, critico: 0 };
            }
            const nivel = ['bajo', 'medio', 'alto', 'critico'][item.criticidad];
            criticidadData[item.grupo][nivel] += item.cantidad;
        });

        const ctx1 = document.getElementById('criticidadChart');
        if (ctx1 && typeof Chart !== 'undefined') {
            this.chartInstances.criticidad = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: Object.keys(criticidadData),
                    datasets: [
                        {
                            label: 'Crítico',
                            data: Object.values(criticidadData).map(d => d.critico),
                            backgroundColor: '#d32f2f',
                            borderWidth: 0
                        },
                        {
                            label: 'Alto',
                            data: Object.values(criticidadData).map(d => d.alto),
                            backgroundColor: '#ff9800',
                            borderWidth: 0
                        },
                        {
                            label: 'Medio',
                            data: Object.values(criticidadData).map(d => d.medio),
                            backgroundColor: '#4caf50',
                            borderWidth: 0
                        },
                        {
                            label: 'Bajo',
                            data: Object.values(criticidadData).map(d => d.bajo),
                            backgroundColor: '#2196f3',
                            borderWidth: 0
                        }
                    ]
                },
                options: {
                    ...baseOptions,
                    scales: {
                        x: { stacked: true, ticks: { maxRotation: 45 } },
                        y: { stacked: true, beginAtZero: true }
                    }
                }
            });
        }
    }

    crearGraficaCostos(baseOptions) {
        const costosData = {};
        this.componentesData.forEach(item => {
            const precio = item.precio_custom || this.obtenerPrecio(item.tipo, item.categoria, item.marca);
            const costo = precio * item.cantidad;
            if (!costosData[item.grupo]) costosData[item.grupo] = 0;
            costosData[item.grupo] += costo;
        });

        const ctx2 = document.getElementById('costosChart');
        if (ctx2 && typeof Chart !== 'undefined') {
            this.chartInstances.costos = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(costosData),
                    datasets: [{
                        data: Object.values(costosData),
                        backgroundColor: [
                            '#1e3c72', '#2a5298', '#d32f2f', '#ff9800', 
                            '#4caf50', '#2196f3', '#9c27b0'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: { ...baseOptions, cutout: '60%' }
            });
        }
    }

    crearGraficaTiempo(baseOptions) {
        const tiempoData = {};
        this.componentesData.forEach((item, index) => {
            const elemento = document.getElementById(`tiempo-${index}`);
            if (elemento) {
                const tiempoTexto = elemento.textContent;
                const tiempo = parseInt(tiempoTexto);
                if (!isNaN(tiempo)) {
                    if (!tiempoData[item.grupo]) tiempoData[item.grupo] = [];
                    tiempoData[item.grupo].push(tiempo);
                }
            }
        });

        const tiempoPromedio = {};
        Object.keys(tiempoData).forEach(grupo => {
            if (tiempoData[grupo].length > 0) {
                tiempoPromedio[grupo] = Math.round(
                    tiempoData[grupo].reduce((a, b) => a + b, 0) / tiempoData[grupo].length
                );
            }
        });

        const ctx3 = document.getElementById('tiempoChart');
        if (ctx3 && typeof Chart !== 'undefined' && Object.keys(tiempoPromedio).length > 0) {
            this.chartInstances.tiempo = new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: Object.keys(tiempoPromedio),
                    datasets: [{
                        label: 'Tiempo Promedio (meses)',
                        data: Object.values(tiempoPromedio),
                        backgroundColor: '#1e3c72',
                        borderColor: '#2a5298',
                        borderWidth: 1
                    }]
                },
                options: {
                    ...baseOptions,
                    scales: {
                        y: { 
                            beginAtZero: true,
                            title: { display: true, text: 'Meses' }
                        }
                    }
                }
            });
        }
    }

    crearGraficaCategoria(baseOptions) {
        const categoriaData = {};
        this.componentesData.forEach(item => {
            const categoria = item.categoria === 'Ruedas' ? 'Ruedas' : item.categoria;
            if (!categoriaData[categoria]) categoriaData[categoria] = 0;
            categoriaData[categoria] += item.cantidad;
        });

        const ctx4 = document.getElementById('categoriaChart');
        if (ctx4 && typeof Chart !== 'undefined') {
            this.chartInstances.categoria = new Chart(ctx4, {
                type: 'pie',
                data: {
                    labels: Object.keys(categoriaData),
                    datasets: [{
                        data: Object.values(categoriaData),
                        backgroundColor: ['#1e3c72', '#d32f2f', '#ff9800', '#4caf50'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: baseOptions
            });
        }
    }

    inicializarCalendario() {
        const calendarEl = document.getElementById('calendario');
        if (!calendarEl || typeof FullCalendar === 'undefined') return;
        
        if (this.calendario) {
            this.calendario.destroy();
        }
        
        this.calendario = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            height: 600,
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,listYear'
            },
            events: this.eventosCalendario,
            eventDisplay: 'block',
            dayMaxEvents: 3,
            moreLinkClick: 'popover',
            eventDidMount: function(info) {
                const tiempoRecambio = info.event.extendedProps.tiempoRecambio;
                if (tiempoRecambio) {
                    info.el.style.fontSize = '10px';
                    info.el.style.fontWeight = 'bold';
                }
            }
        });
        
        this.calendario.render();
    }

    calcularEventosCalendario() {
        const fechaInicio = new Date(document.getElementById('fechaInicio')?.value || '2025-01-01');
        this.eventosCalendario = [];

        this.componentesData.forEach((item, index) => {
            const elemento = document.getElementById(`tiempo-${index}`);
            if (elemento) {
                const tiempoTexto = elemento.textContent;
                const tiempoRecambioMeses = parseInt(tiempoTexto);
                
                if (!isNaN(tiempoRecambioMeses)) {
                    let fechaEvento = new Date(fechaInicio);
                    const fechaFin = new Date(2025, 11, 31);
                    let contadorEventos = 0;
                    
                    while (fechaEvento <= fechaFin && contadorEventos < 20) {
                        fechaEvento = new Date(fechaInicio);
                        fechaEvento.setMonth(fechaEvento.getMonth() + (tiempoRecambioMeses * contadorEventos));
                        
                        if (fechaEvento.getFullYear() === 2025 && fechaEvento <= fechaFin) {
                            let color = '#007bff';
                            let emoji = '🔵';
                            
                            if (tiempoRecambioMeses <= 1) {
                                color = '#dc3545';
                                emoji = '🔴';
                            } else if (tiempoRecambioMeses <= 3) {
                                color = '#28a745';
                                emoji = '🟢';
                            } else if (tiempoRecambioMeses <= 6) {
                                color = '#fd7e14';
                                emoji = '🟠';
                            }
                            
                            this.eventosCalendario.push({
                                title: `${emoji} ${item.tipo} (${item.grupo})`,
                                start: fechaEvento.toISOString().split('T')[0],
                                backgroundColor: color,
                                borderColor: color,
                                textColor: '#ffffff',
                                extendedProps: {
                                    tiempoRecambio: tiempoRecambioMeses,
                                    cantidad: item.cantidad,
                                    aplicacion: item.aplicacion,
                                    marca: item.marca
                                }
                            });
                        }
                        contadorEventos++;
                    }
                }
            }
        });

        if (this.calendario) {
            this.calendario.removeAllEvents();
            this.calendario.addEventSource(this.eventosCalendario);
        }
    }

    /**
     * FUNCIONES PÚBLICAS PARA EL HTML
     */

    cambiarFabricanteGlobal() {
        const elemento = document.getElementById('fabricanteGlobal');
        if (elemento) {
            this.fabricanteGlobal = elemento.value;
            this.llenarTablaConfiguracion();
            this.autoGuardar();
            this.mostrarMensaje(`🔄 Fabricante por defecto cambiado a ${this.fabricanteGlobal}`, 'success');
        }
    }

    aplicarCargasEstimadas() {
        let aplicadas = 0;
        this.componentesData.forEach((item, index) => {
            const cargaEstimada = this.obtenerCargaEstimada(item.marca, item.tipo, item.categoria);
            if (cargaEstimada !== item.carga) {
                item.carga = cargaEstimada;
                aplicadas++;
            }
        });
        
        this.llenarTablaConfiguracion();
        this.autoGuardar();
        this.mostrarMensaje(`⚡ Cargas estimadas aplicadas a ${aplicadas} componentes`, 'success');
    }

    aplicarConfiguracion() {
        this.graficasGeneradas = false;
        this.destruirGraficasExistentes();
        this.calcularTodo();
        this.autoGuardar();
        this.mostrarTab('resumen');
        this.mostrarMensaje('✅ Configuración aplicada y guardada', 'success');
    }

    restaurarDefaults() {
        this.componentesData.splice(0, this.componentesData.length, ...JSON.parse(JSON.stringify(this.componentesDataOriginal)));
        this.fabricanteGlobal = "NSK";
        
        const elementos = {
            'fabricanteGlobal': this.fabricanteGlobal,
            'diasSemana': 5,
            'semanasAno': 50,
            'factorAmbiente': 0.8,
            'margenSeguridad': 1.5,
            'fechaInicio': "2025-01-01"
        };

        Object.entries(elementos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.value = valor;
        });
        
        this.llenarTablaConfiguracion();
        this.autoGuardar();
        this.mostrarMensaje('🔄 Valores restaurados y guardados', 'warning');
    }

    exportarDatos() {
        let csv = 'Tipo,Categoria,Cantidad,Aplicacion,RPM,Carga,Horas_Diarias,Criticidad,Marca,Capacidad_kN,Precio,Tiempo_Recambio_Meses\n';
        
        this.componentesData.forEach((item, index) => {
            const precio = item.precio_custom || this.obtenerPrecio(item.tipo, item.categoria, item.marca);
            const tiempoElement = document.getElementById(`tiempo-${index}`);
            const tiempoRecambio = tiempoElement ? tiempoElement.textContent : 'N/A';
            const capacidadkN = this.obtenerCapacidadCargaParaMostrar(item.tipo, item.marca);
            
            csv += `${item.tipo},${item.categoria},${item.cantidad},"${item.aplicacion}",${item.rpm},${item.carga},${item.horas_diarias},${item.criticidad},${item.marca},${capacidadkN},${precio},"${tiempoRecambio}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analisis_plamph_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }

    mostrarTab(tabName) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Mostrar tab seleccionado
        const tabContent = document.getElementById(`tab-${tabName}`);
        if (tabContent) tabContent.classList.add('active');
        
        // Encontrar y activar el botón de la pestaña
        const tabButtons = document.querySelectorAll('.tab');
        tabButtons.forEach(button => {
            if (button.onclick && button.onclick.toString().includes(tabName)) {
                button.classList.add('active');
            }
        });
        
        // Si se selecciona la pestaña de gráficas, generar o regenerar
        if (tabName === 'graficas') {
            this.graficasGeneradas = false;
            this.destruirGraficasExistentes();
            setTimeout(() => this.generarGraficas(), 200);
        }
        
        // Si se selecciona la pestaña del calendario, inicializar
        if (tabName === 'calendario') {
            setTimeout(() => {
                if (!this.calendario) {
                    this.inicializarCalendario();
                }
                this.calcularEventosCalendario();
            }, 200);
        }
    }

    diagnosticarSistema() {
        console.log('🔍 === DIAGNÓSTICO SISTEMA PLAMPH° ===');
        
        const dependencias = [
            { nombre: 'Chart.js', variable: 'Chart' },
            { nombre: 'FullCalendar', variable: 'FullCalendar' },
            { nombre: 'jsPDF', variable: 'window.jsPDF' },
            { nombre: 'html2canvas', variable: 'html2canvas' },
            { nombre: 'html2pdf', variable: 'html2pdf' },
            { nombre: 'PDFGenerator', variable: 'PDFGenerator' }
        ];
        
        console.log('📋 Verificando dependencias:');
        dependencias.forEach(dep => {
            try {
                const disponible = eval(`typeof ${dep.variable} !== 'undefined'`);
                console.log(`${disponible ? '✅' : '❌'} ${dep.nombre}: ${disponible ? 'OK' : 'NO DISPONIBLE'}`);
            } catch(e) {
                console.log(`❌ ${dep.nombre}: ERROR AL VERIFICAR`);
            }
        });
        
        console.log('\n📊 Verificando datos:');
        console.log(`Componentes cargados: ${this.componentesData ? this.componentesData.length : 0}`);
        console.log(`Datos calculados: ${document.getElementById('componentesCriticos')?.textContent !== '-'}`);
        
        if (typeof diagnosticarPDF === 'function') {
            diagnosticarPDF();
        }
        
        this.mostrarMensaje('🔍 Diagnóstico completado. Ver consola para detalles.', 'info');
    }

    aumentarCriticidadTodos() {
        this.componentesData.forEach((item, index) => {
            if (item.criticidad < 3) {
                item.criticidad += 1;
                const criticidadTexto = ['🟢 Bajo', '🟡 Medio', '🟠 Alto', '🔴 Crítico'][item.criticidad];
                const elemento = document.getElementById(`criticidad-${index}`);
                if (elemento) elemento.textContent = criticidadTexto;
            }
        });
        
        this.autoGuardar();
        this.mostrarMensaje('⬆️ Criticidad aumentada globalmente', 'warning');
    }

    // Funciones de importación/exportación de configuración
    exportarConfiguracion() {
        const configuracion = {
            componentesData: this.componentesData,
            fabricanteGlobal: this.fabricanteGlobal,
            diasSemana: document.getElementById('diasSemana')?.value || 5,
            semanasAno: document.getElementById('semanasAno')?.value || 50,
            factorAmbiente: document.getElementById('factorAmbiente')?.value || 0.8,
            margenSeguridad: document.getElementById('margenSeguridad')?.value || 1.5,
            fechaInicio: document.getElementById('fechaInicio')?.value || "2025-01-01",
            fechaExportacion: new Date().toISOString(),
            version: "2.1"
        };

        const blob = new Blob([JSON.stringify(configuracion, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `configuracion_plamph_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.mostrarMensaje('📤 Configuración exportada correctamente', 'success');
    }

    importarConfiguracion() {
        const input = document.getElementById('archivoConfig');
        if (input) input.click();
    }

    procesarArchivoConfig(input) {
        const archivo = input.files[0];
        if (!archivo) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                if (config.componentesData && config.fabricanteGlobal) {
                    this.aplicarConfiguracionCargada(config);
                    if (this.autoGuardado && this.localStorageDisponible()) {
                        this.guardarConfiguracion();
                    }
                    this.mostrarMensaje('📥 Configuración importada correctamente', 'success');
                } else {
                    this.mostrarMensaje('❌ Archivo de configuración inválido', 'warning');
                }
            } catch(error) {
                this.mostrarMensaje('❌ Error al leer el archivo de configuración', 'warning');
            }
        };
        reader.readAsText(archivo);
        input.value = '';
    }
}

// Crear instancia global
const sistemaPLAMPH = new SistemaPLAMPH();

// Exponer funciones globalmente para compatibilidad con HTML
window.sistemaPLAMPH = sistemaPLAMPH;
window.calcularTodo = () => sistemaPLAMPH.calcularTodo();
window.aplicarCargasEstimadas = () => sistemaPLAMPH.aplicarCargasEstimadas();
window.cambiarFabricanteGlobal = () => sistemaPLAMPH.cambiarFabricanteGlobal();
window.aplicarConfiguracion = () => sistemaPLAMPH.aplicarConfiguracion();
window.restaurarDefaults = () => sistemaPLAMPH.restaurarDefaults();
window.exportarDatos = () => sistemaPLAMPH.exportarDatos();
window.guardarConfiguracion = () => sistemaPLAMPH.guardarConfiguracion();
window.cargarConfiguracion = () => sistemaPLAMPH.cargarConfiguracion();
window.mostrarTab = (tabName) => sistemaPLAMPH.mostrarTab(tabName);
window.diagnosticarSistema = () => sistemaPLAMPH.diagnosticarSistema();
window.aumentarCriticidadTodos = () => sistemaPLAMPH.aumentarCriticidadTodos();
window.exportarConfiguracion = () => sistemaPLAMPH.exportarConfiguracion();
window.importarConfiguracion = () => sistemaPLAMPH.importarConfiguracion();
window.procesarArchivoConfig = (input) => sistemaPLAMPH.procesarArchivoConfig(input);
window.calcularEventosCalendario = () => sistemaPLAMPH.calcularEventosCalendario();

console.log('🏭 Sistema PLAMPH° v2.0 Modular cargado exitosamente');
console.log('✅ Todas las funcionalidades disponibles');
console.log('🎯 Ejecuta sistemaPLAMPH.diagnosticarSistema() para verificar estado');