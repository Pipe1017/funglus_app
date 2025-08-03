# backend_funglusapp/app/routers/informes_router.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import database
from app.crud import crud_informes
from app.schemas import informe_schemas

router = APIRouter(
    prefix="/informes",
    tags=["Informes"],
)

@router.get(
    "/resumen/{ciclo_id}",
    response_model=List[informe_schemas.InformeResumenRow],
    summary="Obtener el resumen de resultados para un ciclo"
)
def get_resumen_ciclo(ciclo_id: int, db: Session = Depends(database.get_db)):
    # ... (esta función se mantiene igual)
    informe_data = crud_informes.get_informe_resumen_by_ciclo(db=db, ciclo_id=ciclo_id)
    return informe_data


# --- ¡NUEVO ENDPOINT PARA EL GRÁFICO HISTÓRICO! ---
@router.post(
    "/historico",
    response_model=informe_schemas.HistoricoResponse,
    summary="Obtener datos históricos para comparar entre ciclos"
)
def get_datos_historicos(
    request: informe_schemas.HistoricoRequest,
    db: Session = Depends(database.get_db)
):
    """
    Recibe una métrica y una lista de combinaciones de catálogos,
    y devuelve una serie de datos históricos a través de todos los ciclos
    para ser graficada.
    """
    if len(request.combinaciones) > 4:
         raise HTTPException(status_code=400, detail="Se permite un máximo de 4 combinaciones para comparar.")

    return crud_informes.get_informe_historico(db=db, request=request)