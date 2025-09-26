import { useState, useEffect } from "react";
import { Activity, Zap, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        // Memory usage (if available)
        const memory = (performance as any).memory;
        const memoryUsage = memory
          ? Math.round(memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        // Render time approximation
        const renderTime = Math.round(currentTime - lastTime);

        setMetrics({
          fps,
          memoryUsage,
          renderTime,
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex space-x-2">
      <Badge variant="secondary" className="retro-border">
        <Activity className="w-3 h-3 mr-1" />
        {metrics.fps} FPS
      </Badge>

      {metrics.memoryUsage > 0 && (
        <Badge variant="secondary" className="retro-border">
          <Zap className="w-3 h-3 mr-1" />
          {metrics.memoryUsage}MB
        </Badge>
      )}

      <Badge variant="secondary" className="retro-border">
        <Clock className="w-3 h-3 mr-1" />
        {metrics.renderTime}ms
      </Badge>
    </div>
  );
}
