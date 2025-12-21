#!/bin/bash

echo "🔍 Verificando archivos que Git va a ignorar..."
echo ""

echo "📁 Raíz del proyecto:"
git status --ignored | grep -E "\.env|\.db|node_modules|__pycache__|\.DS_Store|venv" || echo "   ✅ Sin archivos sensibles detectados"

echo ""
echo "📁 Backend:"
cd backend
git status --ignored | grep -E "\.env|\.db|__pycache__|venv|\.pyc" || echo "   ✅ Sin archivos sensibles detectados"

echo ""
echo "📁 Frontend:"
cd ../frontend
git status --ignored | grep -E "node_modules|dist|\.env" || echo "   ✅ Sin archivos sensibles detectados"

cd ..

echo ""
echo "✅ Verificación completada!"
echo ""
echo "💡 Si ves archivos .env, .db, o node_modules, ¡NO los commiteés!"
