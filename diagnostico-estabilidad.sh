#!/bin/bash
# 🔍 Monitoreo Detallado - Encontrar patrón de intermitencia

echo "════════════════════════════════════════════════════════════════"
echo "🔍 MONITOREO DETALLADO - Intermitencia cada 5 minutos"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Este script monitoreará durante 10 minutos para encontrar el patrón"
echo "Presiona Ctrl+C para detener antes"
echo ""

LOG_FILE="intermitencia-$(date +%Y%m%d_%H%M%S).log"

echo "Guardando logs en: $LOG_FILE"
echo ""

# Contadores
TOTAL=0
SUCCESS=0
FAIL=0
LAST_STATUS=""
FAIL_STREAK=0
MAX_FAIL_STREAK=0

# Función para registrar
log_event() {
    echo "$1" | tee -a "$LOG_FILE"
}

log_event "Inicio del monitoreo: $(date)"
log_event "════════════════════════════════════════════════════════════════"
log_event ""

# Monitoreo por 10 minutos (600 segundos, check cada 2 segundos = 300 checks)
for i in {1..300}; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    TOTAL=$((TOTAL + 1))
    
    # Test HTTP
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://funglus-api.bunnatek.com/api/v1/health 2>&1)
    
    # Test local (para comparar)
    LOCAL_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/health 2>&1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        SUCCESS=$((SUCCESS + 1))
        STATUS="✅ OK"
        FAIL_STREAK=0
        
        # Solo mostrar si cambió de estado
        if [ "$LAST_STATUS" != "OK" ]; then
            log_event "[$TIMESTAMP] ✅ RECUPERADO (Público: $HTTP_CODE, Local: $LOCAL_CODE)"
        else
            echo -n "."  # Progreso silencioso cuando todo va bien
        fi
        
        LAST_STATUS="OK"
    else
        FAIL=$((FAIL + 1))
        STATUS="❌ FAIL"
        FAIL_STREAK=$((FAIL_STREAK + 1))
        
        if [ $FAIL_STREAK -gt $MAX_FAIL_STREAK ]; then
            MAX_FAIL_STREAK=$FAIL_STREAK
        fi
        
        log_event "[$TIMESTAMP] ❌ FALLO #$FAIL_STREAK (Público: $HTTP_CODE, Local: $LOCAL_CODE)"
        
        # Capturar estado de contenedores cuando falla
        if [ $FAIL_STREAK -eq 1 ]; then
            log_event "   → Uptime cloudflared: $(docker ps --filter 'name=funglusapp_cloudflared' --format '{{.Status}}')"
            log_event "   → Uptime backend: $(docker ps --filter 'name=funglusapp_backend' --format '{{.Status}}')"
            
            # Ver últimos 3 logs de cloudflared
            log_event "   → Últimos logs cloudflared:"
            docker logs funglusapp_cloudflared --tail 3 2>&1 | while read line; do
                log_event "      $line"
            done
        fi
        
        LAST_STATUS="FAIL"
    fi
    
    # Cada minuto (30 checks), mostrar resumen
    if [ $((i % 30)) -eq 0 ]; then
        MINUTES=$((i / 30))
        SUCCESS_RATE=$((SUCCESS * 100 / TOTAL))
        echo ""
        log_event "═══ MINUTO $MINUTES ═══ Success: $SUCCESS/$TOTAL ($SUCCESS_RATE%) | Fallos consecutivos max: $MAX_FAIL_STREAK"
        echo ""
    fi
    
    sleep 2
done

echo ""
log_event ""
log_event "════════════════════════════════════════════════════════════════"
log_event "📊 RESUMEN FINAL"
log_event "════════════════════════════════════════════════════════════════"
log_event ""
log_event "Total de tests: $TOTAL"
log_event "Exitosos: $SUCCESS ($(($SUCCESS * 100 / $TOTAL))%)"
log_event "Fallidos: $FAIL ($(($FAIL * 100 / $TOTAL))%)"
log_event "Racha de fallos consecutivos máxima: $MAX_FAIL_STREAK"
log_event ""

# Análisis de patrón
log_event "💡 ANÁLISIS:"
log_event ""

if [ $FAIL -eq 0 ]; then
    log_event "✅ ¡Perfecto! No hubo fallos en 10 minutos"
elif [ $MAX_FAIL_STREAK -lt 5 ]; then
    log_event "⚠️  Fallos esporádicos (racha max: $MAX_FAIL_STREAK)"
    log_event "   → Posible causa: Problema de red o timeout momentáneo"
elif [ $MAX_FAIL_STREAK -gt 50 ]; then
    log_event "🔴 Fallos prolongados (racha max: $MAX_FAIL_STREAK)"
    log_event "   → Posible causa: Backend o Cloudflared caído"
else
    log_event "⚠️  Intermitencia moderada (racha max: $MAX_FAIL_STREAK)"
    log_event "   → Posible causa: Timeout de keep-alive o reconexión del tunnel"
fi

log_event ""
log_event "📁 Log completo guardado en: $LOG_FILE"
log_event ""

# Mostrar comandos útiles
log_event "🔧 COMANDOS ÚTILES PARA DIAGNOSTICAR:"
log_event ""
log_event "Ver logs de cloudflared desde inicio del monitoreo:"
log_event "  docker logs funglusapp_cloudflared --since 10m"
log_event ""
log_event "Ver si cloudflared se reinició:"
log_event "  docker ps | grep cloudflared"
log_event ""
log_event "Ver configuración actual del tunnel:"
log_event "  docker logs funglusapp_cloudflared | grep 'Updated to new configuration' | tail -1"
log_event ""
