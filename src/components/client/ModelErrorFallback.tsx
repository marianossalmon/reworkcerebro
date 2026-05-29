// src/components/ModelErrorFallback.tsx — fallback HTML normal (fuera del Canvas)
export function ModelErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#111', color: '#f87171', fontFamily: 'monospace'
    }}>
      <div>
        <p>Error cargando modelo 3D</p>
        <pre style={{ fontSize: 11, opacity: 0.6 }}>{error.message}</pre>
      </div>
    </div>
  );
}
