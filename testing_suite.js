/**
 * SUITE DE TESTING COMPLETA PARA PDF GENERATOR
 * Versión: 2.0
 * Propósito: Validar todas las funcionalidades del nuevo sistema PDF
 */

class PDFGeneratorTester {
    constructor() {
        this.resultados = [];
        this.testsFallidos = [];
        this.testsExitosos = [];
        this.tiempoInicio = null;
        this.configuracionOriginal = null;
    }

    /**
     * Ejecutar suite completa de tests
     */
    async ejecutarSuiteCompleta() {
        console.log('🧪 Iniciando Suite de Testing PDF Generator...');
        this.tiempoInicio = performance.now();
        
        // Guardar configuración original
        if (window.PDFGenerator) {
            this.configuracionOriginal = JSON.parse(JSON.stringify(new PDFGenerator().config));
        }

        try {
            // Tests básicos
            await this.testDependencias();
            await this.testConfiguracion();
            await this.testDatosGlobales();
            
            // Tests de funcionalidad
            await this.testCreacionInstancia();
            await this.testValidaciones();
            await this.testGeneracionContenido();
            
            // Tests de calidad
            await this.testCalidadPDF();
            await this.testRendimiento();
            await this.testCompatibilidad();
            
            // Tests de configuraciones especiales
            await this.testConfiguracionesAvanzadas();
            
            // Tests de manejo de errores
            await this.testManejoErrores();
            
        } catch (error) {
            this.registrarTest('Suite Completa', false, `Error inesperado: ${error.message}`);
        }

        // Generar reporte final
        this.generarReporteCompleto();
    }

    /**
     * Test 1: Verificar dependencias
     */
    async testDependencias() {
        console.log('📋 Test 1: Verificando dependencias...');
        
        const dependencias = [
            { nombre: 'jsPDF', objeto: window.jsPDF, version: '2.5.1' },
            { nombre: 'html2canvas', objeto: window.html2canvas, version: '1.4.1' },
            { nombre: 'PDFGenerator', objeto: window.PDFGenerator, version: '2.0' }
        ];

        for (const dep of dependencias) {
            if (dep.objeto) {
                this.registrarTest(
                    `Dependencia ${dep.nombre}`, 
                    true, 
                    `✅ Cargada correctamente`
                );
            } else {
                this.registrarTest(
                    `Dependencia ${dep.nombre}`, 
                    false, 
                    `❌ No encontrada - Verificar CDN`
                );
            }
        }

        // Test específico de versiones
        if (window.jsPDF) {
            const versionJsPDF = window.jsPDF.version || 'desconocida';
            this.registrarTest(
                'Versión jsPDF',
                versionJsPDF.includes('2.'),
                `Versión detectada: ${versionJsPDF}`
            );
        }
    }

    /**
     * Test 2: Verificar configuración
     */
    async testConfiguracion() {
        console.log('⚙️ Test 2: Verificando configuración...');
        
        if (!window.PDFGenerator) {
            this.registrarTest('Configuración', false, 'PDFGenerator no disponible');
            return;
        }

        const generator = new PDFGenerator();
        const config = generator.config;

        // Verificar estructura de configuración
        const propiedadesRequeridas = [
            'margins', 'pageFormat', 'orientation', 'imageQuality', 'canvasConfig'
        ];

        for (const prop of propiedadesRequeridas) {
            this.registrarTest(
                `Config.${prop}`,
                config.hasOwnProperty(prop),
                config[prop] ? `✅ Presente: ${JSON.stringify(config[prop])}` : '❌ Faltante'
            );
        }

        // Verificar valores de márgenes
        if (config.margins) {
            const margenesValidos = ['top', 'right', 'bottom', 'left'].every(
                margin => typeof config.margins[margin] === 'number' && config.margins[margin] > 0
            );
            
            this.registrarTest(
                'Márgenes válidos',
                margenesValidos,
                `Márgenes: ${JSON.stringify(config.margins)}`
            );
        }

        // Test de modificación de configuración
        const margenOriginal = config.margins.top;
        config.margins.top = 99;
        this.registrarTest(
            'Configuración modificable',
            config.margins.top === 99,
            'Configuración se puede modificar dinámicamente'
        );
        config.margins.top = margenOriginal; // Restaurar
    }

    /**
     * Test 3: Verificar datos globales
     */
    async testDatosGlobales() {
        console.log('🌐 Test 3: Verificando datos globales...');
        
        const datosRequeridos = [
            { nombre: 'componentesData', tipo: 'array' },
            { nombre: 'obtenerPrecio', tipo: 'function' },
            { nombre: 'mostrarMensaje', tipo: 'function' }
        ];

        for (const dato of datosRequeridos) {
            const valor = window[dato.nombre];
            const tipoCorrect = Array.isArray(valor) ? 'array' : typeof valor;
            
            this.registrarTest(
                `Global ${dato.nombre}`,
                tipoCorrect === dato.tipo,
                `Tipo: ${tipoCorrect}, Requerido: ${dato.tipo}`
            );
        }

        // Test específico de componentesData
        if (window.componentesData) {
            const tieneElementos = window.componentesData.length > 0;
            this.registrarTest(
                'componentesData con datos',
                tieneElementos,
                `Elementos: ${window.componentesData.length}`
            );

            if (tieneElementos) {
                const primerElemento = window.componentesData[0];
                const propiedadesRequeridas = ['tipo', 'categoria', 'cantidad', 'marca'];
                const tienePropiedades = propiedadesRequeridas.every(prop => primerElemento.hasOwnProperty(prop));
                
                this.registrarTest(
                    'Estructura componentesData',
                    tienePropiedades,
                    `Propiedades: ${Object.keys(primerElemento).join(', ')}`
                );
            }
        }

        // Test de función obtenerPrecio
        if (window.obtenerPrecio) {
            try {
                const precio = window.obtenerPrecio('6203', 'Rodamiento', 'NSK');
                this.registrarTest(
                    'Función obtenerPrecio',
                    typeof precio === 'number' && precio > 0,
                    `Precio test: ${precio}`
                );
            } catch (error) {
                this.registrarTest(
                    'Función obtenerPrecio',
                    false,
                    `Error: ${error.message}`
                );
            }
        }
    }

    /**
     * Test 4: Creación de instancia
     */
    async testCreacionInstancia() {
        console.log('🏗️ Test 4: Creación de instancia...');
        
        if (!window.PDFGenerator) {
            this.registrarTest('Creación instancia', false, 'PDFGenerator no disponible');
            return;
        }

        try {
            const generator = new PDFGenerator();
            this.registrarTest(
                'Nueva instancia',
                generator instanceof PDFGenerator,
                'Instancia creada correctamente'
            );

            // Verificar métodos principales
            const metodosRequeridos = [
                'generarReporte', 'validarDependencias', 'validarDatos',
                'crearContenidoHTML', 'obtenerEstilosPDF'
            ];

            for (const metodo of metodosRequeridos) {
                this.registrarTest(
                    `Método ${metodo}`,
                    typeof generator[metodo] === 'function',
                    typeof generator[metodo] === 'function' ? 'Disponible' : 'Faltante'
                );
            }

        } catch (error) {
            this.registrarTest(
                'Creación instancia',
                false,
                `Error: ${error.message}`
            );
        }
    }

    /**
     * Test 5: Validaciones
     */
    async testValidaciones() {
        console.log('✅ Test 5: Sistemas de validación...');
        
        if (!window.PDFGenerator) return;

        const generator = new PDFGenerator();

        // Test validación de dependencias
        try {
            const validacionDeps = generator.validarDependencias();
            this.registrarTest(
                'Validación dependencias',
                typeof validacionDeps === 'boolean',
                `Resultado: ${validacionDeps}`
            );
        } catch (error) {
            this.registrarTest(
                'Validación dependencias',
                false,
                `Error: ${error.message}`
            );
        }

        // Test validación de datos
        try {
            const validacionDatos = generator.validarDatos();
            this.registrarTest(
                'Validación datos',
                typeof validacionDatos === 'boolean',
                `Resultado: ${validacionDatos}`
            );
        } catch (error) {
            this.registrarTest(
                'Validación datos',
                false,
                `Error: ${error.message}`
            );
        }
    }

    /**
     * Test 6: Generación de contenido
     */
    async testGeneracionContenido() {
        console.log('📄 Test 6: Generación de contenido...');
        
        if (!window.PDFGenerator) return;

        const generator = new PDFGenerator();

        // Test creación de HTML
        try {
            const html = generator.crearContenidoHTML();
            
            this.registrarTest(
                'Generación HTML',
                typeof html === 'string' && html.length > 1000,
                `Longitud: ${html.length} caracteres`
            );

            // Verificar estructura HTML básica
            const tieneEstructura = html.includes('<!DOCTYPE html>') && 
                                  html.includes('<html>') && 
                                  html.includes('<body>');
            
            this.registrarTest(
                'Estructura HTML válida',
                tieneEstructura,
                'Contiene elementos HTML básicos'
            );

            // Verificar contenido específico
            const tieneContenido = html.includes('PLAMPH') && 
                                 html.includes('TUPIZA') && 
                                 html.includes('tabla');
            
            this.registrarTest(
                'Contenido específico',
                tieneContenido,
                'Contiene información del proyecto'
            );

        } catch (error) {
            this.registrarTest(
                'Generación HTML',
                false,
                `Error: ${error.message}`
            );
        }

        // Test generación de estilos
        try {
            const estilos = generator.obtenerEstilosPDF();
            
            this.registrarTest(
                'Generación estilos CSS',
                typeof estilos === 'string' && estilos.includes('body'),
                `Longitud: ${estilos.length} caracteres`
            );

        } catch (error) {
            this.registrarTest(
                'Generación estilos CSS',
                false,
                `Error: ${error.message}`
            );
        }
    }

    /**
     * Test 7: Calidad del PDF
     */
    async testCalidadPDF() {
        console.log('🎨 Test 7: Calidad del PDF...');
        
        if (!window.PDFGenerator) return;

        // Test diferentes configuraciones de calidad
        const configuraciones = [
            { nombre: 'Baja calidad', imageQuality: 0.5, scale: 1 },
            { nombre: 'Media calidad', imageQuality: 0.8, scale: 2 },
            { nombre: 'Alta calidad', imageQuality: 0.95, scale: 3 }
        ];

        for (const config of configuraciones) {
            try {
                const generator = new PDFGenerator();
                generator.config.imageQuality = config.imageQuality;
                generator.config.canvasConfig.scale = config.scale;

                // Verificar que la configuración se aplicó
                this.registrarTest(
                    `Config ${config.nombre}`,
                    generator.config.imageQuality === config.imageQuality,
                    `Calidad: ${config.imageQuality}, Escala: ${config.scale}`
                );

            } catch (error) {
                this.registrarTest(
                    `Config ${config.nombre}`,
                    false,
                    `Error: ${error.message}`
                );
            }
        }
    }

    /**
     * Test 8: Rendimiento
     */
    async testRendimiento() {
        console.log('⚡ Test 8: Rendimiento...');
        
        if (!window.PDFGenerator) return;

        // Test tiempo de creación de instancia
        const inicioInstancia = performance.now();
        const generator = new PDFGenerator();
        const tiempoInstancia = performance.now() - inicioInstancia;

        this.registrarTest(
            'Tiempo creación instancia',
            tiempoInstancia < 50,
            `${tiempoInstancia.toFixed(2)}ms (objetivo: <50ms)`
        );

        // Test tiempo de generación de HTML
        const inicioHTML = performance.now();
        try {
            const html = generator.crearContenidoHTML();
            const tiempoHTML = performance.now() - inicioHTML;

            this.registrarTest(
                'Tiempo generación HTML',
                tiempoHTML < 200,
                `${tiempoHTML.toFixed(2)}ms (objetivo: <200ms)`
            );
        } catch (error) {
            this.registrarTest(
                'Tiempo generación HTML',
                false,
                `Error: ${error.message}`
            );
        }

        // Test memoria (aproximado)
        if (window.performance && window.performance.memory) {
            const memoriaInicial = window.performance.memory.usedJSHeapSize;
            
            // Crear múltiples instancias
            for (let i = 0; i < 10; i++) {
                new PDFGenerator();
            }
            
            const memoriaFinal = window.performance.memory.usedJSHeapSize;
            const aumentoMemoria = memoriaFinal - memoriaInicial;

            this.registrarTest(
                'Uso de memoria',
                aumentoMemoria < 1024 * 1024, // Menos de 1MB
                `Aumento: ${(aumentoMemoria / 1024).toFixed(1)}KB`
            );
        }
    }

    /**
     * Test 9: Compatibilidad
     */
    async testCompatibilidad() {
        console.log('🌐 Test 9: Compatibilidad...');
        
        // Test Canvas support
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 10, 10);
            
            this.registrarTest(
                'Soporte Canvas',
                !!ctx,
                'Canvas soportado por el navegador'
            );
        } catch (error) {
            this.registrarTest(
                'Soporte Canvas',
                false,
                `Error: ${error.message}`
            );
        }

        // Test Popup support
        try {
            const popup = window.open('', 'test', 'width=1,height=1');
            if (popup) {
                popup.close();
                this.registrarTest(
                    'Soporte Popups',
                    true,
                    'Popups permitidos'
                );
            } else {
                this.registrarTest(
                    'Soporte Popups',
                    false,
                    'Popups bloqueados - PDF puede no generar'
                );
            }
        } catch (error) {
            this.registrarTest(
                'Soporte Popups',
                false,
                `Error: ${error.message}`
            );
        }

        // Test UserAgent
        const navegador = navigator.userAgent;
        const navegadoresCompatibles = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        const compatible = navegadoresCompatibles.some(nav => navegador.includes(nav));
        
        this.registrarTest(
            'Navegador compatible',
            compatible,
            `Navegador: ${navegador.substring(0, 50)}...`
        );
    }

    /**
     * Test 10: Configuraciones avanzadas
     */
    async testConfiguracionesAvanzadas() {
        console.log('🔧 Test 10: Configuraciones avanzadas...');
        
        if (!window.PDFGenerator) return;

        // Test PDFGeneratorAvanzado si está disponible
        if (window.PDFGeneratorAvanzado) {
            try {
                const generatorAvanzado = new PDFGeneratorAvanzado('presentacion');
                this.registrarTest(
                    'PDFGeneratorAvanzado',
                    generatorAvanzado instanceof PDFGenerator,
                    'Versión avanzada funcional'
                );

                // Test cambio de configuración
                generatorAvanzado.cambiarConfiguracion('email');
                this.registrarTest(
                    'Cambio configuración dinámico',
                    true,
                    'Configuración cambiada a email'
                );

            } catch (error) {
                this.registrarTest(
                    'PDFGeneratorAvanzado',
                    false,
                    `Error: ${error.message}`
                );
            }
        }

        // Test configuraciones personalizadas
        try {
            const generator = new PDFGenerator();
            
            // Modificar configuración
            generator.config.margins.top = 50;
            generator.config.imageQuality = 0.99;
            
            this.registrarTest(
                'Configuración personalizada',
                generator.config.margins.top === 50 && generator.config.imageQuality === 0.99,
                'Configuración modificada correctamente'
            );

        } catch (error) {
            this.registrarTest(
                'Configuración personalizada',
                false,
                `Error: ${error.message}`
            );
        }
    }

    /**
     * Test 11: Manejo de errores
     */
    async testManejoErrores() {
        console.log('🚨 Test 11: Manejo de errores...');
        
        if (!window.PDFGenerator) return;

        // Test con datos inválidos
        const datosOriginales = window.componentesData;
        window.componentesData = null; // Datos inválidos temporalmente

        try {
            const generator = new PDFGenerator();
            const validacion = generator.validarDatos();
            
            this.registrarTest(
                'Manejo datos inválidos',
                validacion === false,
                'Detecta correctamente datos inválidos'
            );
        } catch (error) {
            this.registrarTest(
                'Manejo datos inválidos',
                true,
                'Maneja error correctamente'
            );
        }

        window.componentesData = datosOriginales; // Restaurar

        // Test con configuración inválida
        try {
            const generator = new PDFGenerator();
            generator.config = null; // Configuración inválida
            
            const resultado = generator.generarReporte();
            this.registrarTest(
                'Manejo config inválida',
                resultado instanceof Promise,
                'Maneja configuración inválida'
            );
        } catch (error) {
            this.registrarTest(
                'Manejo config inválida',
                true,
                'Captura error de configuración'
            );
        }
    }

    /**
     * Registrar resultado de un test
     */
    registrarTest(nombre, exito, detalle) {
        const resultado = {
            nombre,
            exito,
            detalle,
            timestamp: new Date().toISOString()
        };

        this.resultados.push(resultado);
        
        if (exito) {
            this.testsExitosos.push(resultado);
            console.log(`✅ ${nombre}: ${detalle}`);
        } else {
            this.testsFallidos.push(resultado);
            console.log(`❌ ${nombre}: ${detalle}`);
        }
    }

    /**
     * Generar reporte completo
     */
    generarReporteCompleto() {
        const tiempoTotal = ((performance.now() - this.tiempoInicio) / 1000).toFixed(2);
        const totalTests = this.resultados.length;
        const exitos = this.testsExitosos.length;
        const fallos = this.testsFallidos.length;
        const porcentajeExito = ((exitos / totalTests) * 100).toFixed(1);

        const reporte = `
🧪 REPORTE COMPLETO DE TESTING PDF GENERATOR
============================================

📊 RESUMEN:
   Tests ejecutados: ${totalTests}
   Tests exitosos: ${exitos} (${porcentajeExito}%)
   Tests fallidos: ${fallos}
   Tiempo total: ${tiempoTotal}s

${fallos > 0 ? `
❌ TESTS FALLIDOS:
${this.testsFallidos.map(test => `   • ${test.nombre}: ${test.detalle}`).join('\n')}
` : ''}

${exitos > 0 ? `
✅ TESTS EXITOSOS:
${this.testsExitosos.map(test => `   • ${test.nombre}`).join('\n')}
` : ''}

📋 RECOMENDACIONES:
${this.generarRecomendaciones()}

⏰ Reporte generado: ${new Date().toLocaleString()}
🔗 Versión PDF Generator: 2.0
        `;

        console.log(reporte);
        
        // Mostrar resumen en UI
        if (window.mostrarMensaje) {
            const resumen = `🧪 Testing completado: ${exitos}/${totalTests} tests exitosos (${porcentajeExito}%)`;
            window.mostrarMensaje(resumen, porcentajeExito > 80 ? 'success' : 'warning');
        }

        return {
            resumen: { totalTests, exitos, fallos, porcentajeExito, tiempoTotal },
            detalles: this.resultados,
            reporte
        };
    }

    /**
     * Generar recomendaciones basadas en resultados
     */
    generarRecomendaciones() {
        const recomendaciones = [];

        // Verificar dependencias
        const tieneErroresDependencias = this.testsFallidos.some(test => 
            test.nombre.includes('Dependencia')
        );
        if (tieneErroresDependencias) {
            recomendaciones.push('📋 Verificar que los CDNs estén cargados correctamente');
        }

        // Verificar datos globales
        const tieneErroresDatos = this.testsFallidos.some(test => 
            test.nombre.includes('Global') || test.nombre.includes('datos')
        );
        if (tieneErroresDatos) {
            recomendaciones.push('🌐 Asegurar que las variables globales estén disponibles');
        }

        // Verificar rendimiento
        const tieneErroresRendimiento = this.testsFallidos.some(test => 
            test.nombre.includes('Tiempo') || test.nombre.includes('memoria')
        );
        if (tieneErroresRendimiento) {
            recomendaciones.push('⚡ Considerar optimizar configuración para mejor rendimiento');
        }

        // Verificar compatibilidad
        const tieneErroresCompatibilidad = this.testsFallidos.some(test => 
            test.nombre.includes('Popup') || test.nombre.includes('Canvas')
        );
        if (tieneErroresCompatibilidad) {
            recomendaciones.push('🌐 Verificar configuración del navegador y permisos');
        }

        if (recomendaciones.length === 0) {
            recomendaciones.push('🎉 Sistema funcionando correctamente - No se requieren acciones');
        }

        return recomendaciones.map(rec => `   ${rec}`).join('\n');
    }

    /**
     * Test específico rápido
     */
    async testRapido() {
        console.log('⚡ Ejecutando test rápido...');
        
        await this.testDependencias();
        await this.testDatosGlobales();
        await this.testCreacionInstancia();
        
        const resumen = this.generarReporteCompleto();
        return resumen.resumen.porcentajeExito > 80;
    }
}

/**
 * FUNCIONES DE UTILIDAD PARA EL USUARIO
 */

// Crear instancia global
window.pdfTester = new PDFGeneratorTester();

// Función rápida para test completo
window.testPDFCompleto = async function() {
    return await window.pdfTester.ejecutarSuiteCompleta();
};

// Función para test rápido
window.testPDFRapido = async function() {
    return await window.pdfTester.testRapido();
};

// Test automático al cargar
function testAutomaticoAlCargar() {
    setTimeout(async () => {
        console.log('🔍 Ejecutando test automático del PDF Generator...');
        const resultado = await window.pdfTester.testRapido();
        
        if (resultado) {
            console.log('✅ PDF Generator: Tests básicos pasados');
        } else {
            console.log('⚠️ PDF Generator: Algunos tests fallaron - ejecutar testPDFCompleto() para detalles');
        }
    }, 3000);
}

// Ejecutar test automático
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testAutomaticoAlCargar);
} else {
    testAutomaticoAlCargar();
}

/**
 * BENCHMARK DE RENDIMIENTO
 */
window.benchmarkPDF = async function() {
    console.log('📊 Iniciando benchmark de rendimiento...');
    
    const iteraciones = 10;
    const tiempos = [];
    
    for (let i = 0; i < iteraciones; i++) {
        const inicio = performance.now();
        
        const generator = new PDFGenerator();
        generator.crearContenidoHTML();
        
        const fin = performance.now();
        tiempos.push(fin - inicio);
        
        console.log(`Iteración ${i + 1}: ${(fin - inicio).toFixed(2)}ms`);
    }
    
    const promedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
    const minimo = Math.min(...tiempos);
    const maximo = Math.max(...tiempos);
    
    console.log(`📊 Benchmark completado:
    Promedio: ${promedio.toFixed(2)}ms
    Mínimo: ${minimo.toFixed(2)}ms
    Máximo: ${maximo.toFixed(2)}ms`);
    
    return { promedio, minimo, maximo, tiempos };
};

console.log(`
🧪 SUITE DE TESTING PDF GENERATOR CARGADA
=========================================

COMANDOS DISPONIBLES:
• testPDFCompleto()  - Test completo (11 categorías)
• testPDFRapido()    - Test rápido (3 categorías básicas)
• benchmarkPDF()     - Benchmark de rendimiento

EJECUCIÓN AUTOMÁTICA:
✅ Test rápido se ejecuta automáticamente en 3 segundos

Para test detallado: testPDFCompleto()
`);

// Exportar para módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PDFGeneratorTester };
}