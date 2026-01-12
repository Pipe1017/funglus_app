#!/bin/bash
# 🧹 LIMPIEZA SEGURA - SOLO PROYECTO FUNGLUSAPP
# Este script NO tocará otros proyectos, contenedores o volúmenes

echo "════════════════════════════════════════════════════════════════"
echo "🧹 LIMPIEZA SEGURA - SOLO FUNGLUSAPP"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Este script SOLO afecta contenedores/redes de FunglusApp"
echo "✅ NO tocará otros proyectos"
echo "✅ NO borrará volúmenes de otras bases de datos"
echo ""

# Paso 1: Verificar docker-compose.yml
echo "📋 PASO 1: Verificando docker-compose.yml"
echo "────────────────────────────────────────────────────────────────"
if grep -q "tunnel --config" docker-compose.yml; then
    echo "⚠️  ADVERTENCIA: docker-compose.yml todavía tiene --config"
    echo "   Necesitas cambiar la línea 'command' del servicio cloudflared a:"
    echo "   command: tunnel run"
    echo ""
    read -p "¿Ya actualizaste el docker-compose.yml? (y/n): " UPDATED
    if [ "$UPDATED" != "y" ]; then
        echo "❌ Por favor actualiza docker-compose.yml primero"
        exit 1
    fi
fi
echo "✅ docker-compose.yml parece correcto"
echo ""

# Paso 2: Mostrar qué se va a eliminar
echo "📊 PASO 2: Verificando contenedores de FunglusApp"
echo "────────────────────────────────────────────────────────────────"
echo "Contenedores que se detendrán:"
docker-compose ps --services 2>/dev/null || docker ps --filter "name=funglusapp" --format "table {{.Names}}\t{{.Status}}"
echo ""

# Confirmación
read -p "¿Continuar con la limpieza SOLO de FunglusApp? (y/n): " CONTINUE
if [ "$CONTINUE" != "y" ]; then
    echo "❌ Operación cancelada"
    exit 0
fi
echo ""

# Paso 3: Detener y eliminar SOLO contenedores de este proyecto
echo "🛑 PASO 3: Deteniendo contenedores de FunglusApp"
echo "────────────────────────────────────────────────────────────────"
docker-compose down --remove-orphans
echo "✅ Contenedores de FunglusApp detenidos y eliminados"
echo ""

# Paso 4: Eliminar SOLO las redes de este proyecto
echo "🌐 PASO 4: Limpiando SOLO redes de FunglusApp"
echo "────────────────────────────────────────────────────────────────"
# Eliminar solo redes que coincidan con el nombre del proyecto
docker network ls --filter "name=funglus" --format "{{.Name}}" | while read network; do
    echo "  Eliminando red: $network"
    docker network rm "$network" 2>/dev/null || echo "  (ya eliminada o en uso)"
done
echo "✅ Redes de FunglusApp limpiadas"
echo ""

# Paso 5: Verificar que NO se tocaron otros proyectos
echo "🔍 PASO 5: Verificando otros proyectos (NO se tocan)"
echo "────────────────────────────────────────────────────────────────"
echo "Contenedores de OTROS proyectos (deben seguir corriendo):"
docker ps --filter "name=^(?!funglusapp).*" --format "table {{.Names}}\t{{.Status}}" | head -10
echo ""
echo "Volúmenes de OTROS proyectos (intactos):"
docker volume ls --filter "name=^(?!funglus).*" --format "table {{.Name}}" | head -10
echo ""

# Paso 6: Reconstruir imágenes (opcional)
echo "🖼️  PASO 6: Reconstruir imágenes (opcional)"
echo "────────────────────────────────────────────────────────────────"
read -p "¿Quieres reconstruir las imágenes desde cero? (y/n): " REBUILD
echo ""

# Paso 7: Levantar servicios
echo "🚀 PASO 7: Levantando FunglusApp"
echo "────────────────────────────────────────────────────────────────"
if [ "$REBUILD" = "y" ]; then
    echo "Construyendo imágenes desde cero..."
    docker-compose build --no-cache
    echo ""
    echo "Levantando servicios..."
    docker-compose up -d
else
    echo "Levantando servicios (sin rebuild)..."
    docker-compose up -d --build
fi
echo ""

# Paso 8: Esperar inicialización
echo "⏳ PASO 8: Esperando inicialización (15 segundos)"
echo "────────────────────────────────────────────────────────────────"
sleep 15
echo ""

# Paso 9: Verificar estado
echo "✅ PASO 9: Estado de FunglusApp"
echo "────────────────────────────────────────────────────────────────"
docker-compose ps
echo ""

# Paso 10: Verificar red
echo "🌐 PASO 10: Verificando red de Docker"
echo "────────────────────────────────────────────────────────────────"
NETWORK_NAME=$(docker network ls --filter "name=funglus" --format "{{.Name}}" | head -1)
if [ -n "$NETWORK_NAME" ]; then
    echo "Red activa: $NETWORK_NAME"
    echo ""
    echo "Contenedores en la red:"
    docker network inspect "$NETWORK_NAME" --format '{{range .Containers}}  - {{.Name}}{{println}}{{end}}'
else
    echo "⚠️  No se encontró red de FunglusApp (puede estar iniciando)"
fi
echo ""

# Paso 11: Logs de cloudflared
echo "📋 PASO 11: Logs de Cloudflare Tunnel"
echo "────────────────────────────────────────────────────────────────"
docker logs funglusapp_cloudflared --tail 20 2>/dev/null || echo "⏳ Cloudflared aún iniciando..."
echo ""

# Paso 12: Probar backend localmente
echo "🧪 PASO 12: Probando backend local"
echo "────────────────────────────────────────────────────────────────"
sleep 5  # Esperar un poco más
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/health 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Backend funcionando (HTTP $HTTP_CODE)"
    curl -s http://localhost:8000/api/v1/health | head -c 200
    echo "..."
else
    echo "⏳ Backend iniciando (HTTP $HTTP_CODE)"
    echo "   Espera 1-2 minutos más si es la primera vez"
fi
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ LIMPIEZA COMPLETADA - SOLO FUNGLUSAPP"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📊 RESUMEN:"
echo "  ✅ FunglusApp reiniciado limpiamente"
echo "  ✅ Otros proyectos NO fueron afectados"
echo "  ✅ Volúmenes de otras bases de datos intactos"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. Configura hostnames en Cloudflare Dashboard:"
echo "   https://one.dash.cloudflare.com/"
echo "   → Zero Trust → Networks → Tunnels → funglus-tunnel"
echo ""
echo "   Hostname 1: funglus.bunnatek.com → frontend:80"
echo "   Hostname 2: funglus-api.bunnatek.com → backend:8000"
echo ""
echo "2. Espera 2-3 minutos"
echo ""
echo "3. Prueba:"
echo "   curl https://funglus-api.bunnatek.com/api/v1/health"
echo ""
echo "4. Ver logs en tiempo real:"
echo "   docker logs funglusapp_cloudflared -f"
echo ""