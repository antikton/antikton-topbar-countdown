/**
 * Frontend JavaScript for Topbar Countdown Notice
 * Enhanced with smooth transitions and better color management
 */

(function () {
    'use strict';

    // Debug logging function - only logs if debug mode is enabled
    function debugLog() {
        if (typeof antitocoData !== 'undefined' && antitocoData.debugMode) {
            console.log.apply(console, arguments);
        }
    }

    debugLog('═══════════════════════════════════════════════════');
    debugLog('🚀 TCN Frontend JavaScript - Cargado correctamente');
    debugLog('═══════════════════════════════════════════════════');

    // Store original styles for smooth transitions
    var originalStyles = {
        transition: '',
        backgroundColor: '',
        color: ''
    };

    // Save original styles before any transitions
    function saveOriginalStyles(element) {
        if (!element) return;

        originalStyles = {
            transition: element.style.transition,
            backgroundColor: element.style.backgroundColor,
            color: element.style.color,
            height: element.style.height,
            opacity: element.style.opacity
        };
    }

    // Apply smooth transition to element
    function applyTransition(element, properties, duration = 300) {
        if (!element) return;

        // Save current styles if not already saved
        if (!originalStyles.transition) {
            saveOriginalStyles(element);
        }

        // Apply transition
        element.style.transition = Object.entries(properties)
            .map(([prop]) => `${prop} ${duration}ms ease-in-out`)
            .join(', ');

        // Apply new styles
        Object.entries(properties).forEach(([prop, value]) => {
            if (value !== undefined) {
                element.style[prop] = value;
            }
        });

        // Return a promise that resolves when transition ends
        return new Promise(resolve => {
            const onTransitionEnd = () => {
                element.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            element.addEventListener('transitionend', onTransitionEnd);

            // Fallback in case transitionend doesn't fire
            setTimeout(resolve, duration + 100);
        });
    }

    // Smooth transition to alternative content
    async function transitionToAlternative() {
        debugLog('🎨 transitionToAlternative() - Iniciando...');

        const topbar = document.getElementById('antitoco-topbar');
        if (!topbar) {
            debugLog('❌ Error: No se encontró el elemento #antitoco-topbar');
            return;
        }

        if (!antitocoData) {
            debugLog('❌ Error: antitocoData no está definido');
            return;
        }

        const finishAction = antitocoData.finishAction;
        debugLog('🎬 Acción a ejecutar:', finishAction);

        const contentDiv = topbar.querySelector('.antitoco-content');
        const countdownWrapper = topbar.querySelector('.antitoco-countdown-wrapper');
        const linkElement = topbar.querySelector('.antitoco-link');

        if (finishAction === 'hide') {
            debugLog('👻 Ocultando la barra...');
            // Smooth collapse and fade out
            await applyTransition(topbar, {
                opacity: '0',
                height: '0',
                padding: '0',
                margin: '0',
                overflow: 'hidden'
            }, 500);

            topbar.style.display = 'none';
            debugLog('✅ Barra ocultada correctamente');

        } else if (finishAction === 'show_alternative' && antitocoData.alternativeText) {
            debugLog('🔄 Mostrando contenido alternativo...');
            // First, fade out current content
            await applyTransition(topbar, { opacity: '0' });

            // Update colors if custom colors are enabled
            if (antitocoData.alternativeColorsMode === 'custom') {
                debugLog('🎨 Aplicando colores personalizados:', antitocoData.alternativeBgColor, antitocoData.alternativeTextColor);
                topbar.style.backgroundColor = antitocoData.alternativeBgColor || '';
                topbar.style.color = antitocoData.alternativeTextColor || '';

                // Update link color if it exists
                if (linkElement) {
                    linkElement.style.color = antitocoData.alternativeTextColor || '';
                    linkElement.style.borderColor = antitocoData.alternativeTextColor || '';
                }
            }

            // Update content
            if (contentDiv) {
                debugLog('📝 Actualizando contenido:', antitocoData.alternativeText.substring(0, 50) + '...');
                contentDiv.innerHTML = antitocoData.alternativeText;
            }

            // Hide countdown if it exists
            if (countdownWrapper) {
                debugLog('⏱️  Ocultando countdown');
                countdownWrapper.style.display = 'none';
            }

            // Update or create link
            if (antitocoData.alternativeLink) {
                debugLog('🔗 Configurando enlace alternativo:', antitocoData.alternativeLink);
                if (!linkElement) {
                    const newLink = document.createElement('a');
                    newLink.className = 'antitoco-link';
                    newLink.style.transition = 'all 0.3s ease';
                    topbar.querySelector('.antitoco-topbar-inner').appendChild(newLink);
                    newLink.href = antitocoData.alternativeLink;
                    newLink.textContent = antitocoData.alternativeLinkText || 'Learn more';

                    if (antitocoData.alternativeLinkTab) {
                        newLink.target = '_blank';
                        newLink.rel = 'noopener noreferrer';
                    }

                    // Apply alternative text color if custom colors are enabled
                    if (antitocoData.alternativeColorsMode === 'custom' && antitocoData.alternativeTextColor) {
                        newLink.style.color = antitocoData.alternativeTextColor;
                        newLink.style.borderColor = antitocoData.alternativeTextColor;
                    }
                } else {
                    linkElement.href = antitocoData.alternativeLink;
                    linkElement.textContent = antitocoData.alternativeLinkText || 'Learn more';
                    linkElement.style.display = 'inline-block';

                    if (antitocoData.alternativeLinkTab) {
                        linkElement.target = '_blank';
                        linkElement.rel = 'noopener noreferrer';
                    } else {
                        linkElement.removeAttribute('target');
                        linkElement.removeAttribute('rel');
                    }
                }
            } else if (linkElement) {
                linkElement.style.display = 'none';
            }

            // Fade in with new content
            debugLog('✨ Mostrando contenido alternativo con fade in');
            await applyTransition(topbar, { opacity: '1' });
            debugLog('✅ Transición a contenido alternativo completada');
        } else {
            debugLog('⚠️  No se ejecutó ninguna acción (finishAction:', finishAction, ', alternativeText:', !!antitocoData.alternativeText, ')');
        }
    }

    // Initialize countdown timer
    function initCountdown() {
        var countdownElement = document.getElementById('antitoco-countdown');
        if (!countdownElement) {
            debugLog('TCN Countdown: Elemento countdown no encontrado');
            return;
        }

        // Get target timestamp from localized data
        var targetTimestamp = parseInt(antitocoData.countdownTarget, 10);
        if (!targetTimestamp || targetTimestamp <= 0) {
            debugLog('TCN Countdown: No hay target timestamp configurado');
            return;
        }

        // Calculate time difference between server and client
        var serverTime = parseInt(antitocoData.serverTime, 10);
        var clientTime = Math.floor(Date.now() / 1000);
        var timeDifference = serverTime - clientTime;

        // Log initial configuration
        debugLog('═══════════════════════════════════════════════════');
        debugLog('TCN Countdown - Configuración Inicial');
        debugLog('═══════════════════════════════════════════════════');

        var targetDate = new Date(targetTimestamp * 1000);
        debugLog('🎯 Fecha/Hora de Finalización:', targetDate.toLocaleString());
        debugLog('⏰ Timestamp de Finalización:', targetTimestamp);
        debugLog('🕐 Tiempo del Servidor:', new Date(serverTime * 1000).toLocaleString());
        debugLog('🕐 Tiempo del Cliente:', new Date(clientTime * 1000).toLocaleString());
        debugLog('⚖️  Diferencia (servidor - cliente):', timeDifference, 'segundos');
        debugLog('🎬 Acción a Realizar:', antitocoData.finishAction || 'hide');

        if (antitocoData.finishAction === 'show_alternative') {
            debugLog('📝 Texto Alternativo:', antitocoData.alternativeText ? 'Configurado' : 'No configurado');
            debugLog('🔗 Enlace Alternativo:', antitocoData.alternativeLink || 'No configurado');
            debugLog('🎨 Colores Personalizados:', antitocoData.alternativeColorsMode === 'custom' ? 'Sí' : 'No');
        }

        // Use server-synchronized time for accurate countdown
        var now = Math.floor(Date.now() / 1000) + timeDifference;
        var diff = targetTimestamp - now;
        debugLog('⏱️  Tiempo Restante (segundos):', diff);
        debugLog('═══════════════════════════════════════════════════');

        var labels = antitocoData.labels || {
            days: 'd',
            hours: 'h',
            minutes: 'm',
            seconds: 's'
        };

        // Variable to track if countdown has ended (in this session only)
        var countdownEnded = false;

        // If countdown already ended, show the final state
        if (diff <= 0) {
            debugLog('🏁 Ejecutando acción de finalización inmediatamente');
            handleCountdownEnd();
            return;
        }

        // Function to format time values
        function formatTime(value) {
            return value < 10 ? '0' + value : value;
        }

        // Function to update the countdown display
        function updateDisplay(days, hours, minutes, seconds) {
            var display = [];

            // Always show days, hours, and minutes (even if 0)
            display.push(days + labels.days);
            display.push(formatTime(hours) + labels.hours);
            display.push(formatTime(minutes) + labels.minutes);

            // Show seconds only if enabled in settings
            if (antitocoData.showSeconds) {
                display.push(formatTime(seconds) + labels.seconds);
            }

            countdownElement.textContent = display.join(' ');
        }

        // Handle countdown completion
        function handleCountdownEnd() {
            debugLog('═══════════════════════════════════════════════════');
            debugLog('🏁 COUNTDOWN FINALIZADO - Ejecutando acción');
            debugLog('🎬 Acción:', antitocoData.finishAction);
            debugLog('═══════════════════════════════════════════════════');

            // Update display to show zeros
            updateDisplay(0, 0, 0, 0);

            // Trigger the transition
            debugLog('🎨 Iniciando transición...');
            transitionToAlternative();
        }

        // Main update function
        function updateCountdown() {
            // Get current time in seconds (synchronized with server)
            var now = Math.floor(Date.now() / 1000) + timeDifference;
            var diff = targetTimestamp - now;

            // If countdown finished
            if (diff <= 0) {
                if (!countdownEnded) {
                    countdownEnded = true;
                    handleCountdownEnd();
                }
                return;
            }

            // Calculate time units
            var days = Math.floor(diff / 86400);
            var remainingDiff = diff - (days * 86400);
            var hours = Math.floor(remainingDiff / 3600) % 24;
            remainingDiff -= hours * 3600;
            var minutes = Math.floor(remainingDiff / 60) % 60;
            var seconds = remainingDiff % 60;

            // Log countdown every second
            debugLog('⏱️  Countdown:', days + 'd', hours + 'h', minutes + 'm', seconds + 's', '(' + diff + 's restantes)');

            // Update the display
            updateDisplay(days, hours, minutes, seconds);
        }

        // Initial update
        updateCountdown();

        // Update the countdown every second
        var countdownInterval = setInterval(function () {
            // Check if we should stop the interval
            if (countdownEnded) {
                clearInterval(countdownInterval);
                return;
            }
            updateCountdown();
        }, 1000);
    }

    // Initialize on DOM ready
    debugLog('📋 Verificando disponibilidad de antitocoData:', typeof antitocoData !== 'undefined' ? 'Disponible' : 'NO disponible');
    if (typeof antitocoData !== 'undefined') {
        debugLog('📦 antitocoData:', antitocoData);
    }

    if (document.readyState === 'loading') {
        debugLog('⏳ DOM aún cargando, esperando DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', function () {
            debugLog('✅ DOMContentLoaded disparado');
            initCountdown();
        });
    } else {
        debugLog('✅ DOM ya cargado, inicializando inmediatamente');
        initCountdown();
    }

})();



