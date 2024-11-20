import asyncio
from fastapi import FastAPI
import socketio
import uuid
import sys
import io
import contextlib

sio = socketio.AsyncServer(async_mode='asgi')
app = FastAPI()
app.mount("/ws", socketio.ASGIApp(sio))

# Maintenir l'état des variables entre les exécutions
execution_globals = {}

@sio.event
async def connect(sid, environ):
    print(f"Client connecté: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client déconnecté: {sid}")

@sio.event
async def execute_code(sid, data):
    code = data.get('code')
    cell_id = data.get('cellId', 1)
    try:
        # Capture de la sortie standard
        f = io.StringIO()
        with contextlib.redirect_stdout(f):
            exec(code, execution_globals)
        output = f.getvalue() or "Exécution réussie sans output."
    except Exception as e:
        output = str(e)
    
    await sio.emit('execution_result', {'cellId': cell_id, 'output': output}, to=sid)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
