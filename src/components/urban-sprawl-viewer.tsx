'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Grid3X3,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AVAILABLE_YEARS, 
  getImageUrl
} from '@/lib/urban-sprawl-utils';

interface ImageState {
  scale: number;
  translateX: number;
  translateY: number;
}

export function UrbanSprawlViewer() {
  const [selectedYear, setSelectedYear] = useState(AVAILABLE_YEARS[0]);
  const [comparisonYear, setComparisonYear] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000);
  const [viewMode, setViewMode] = useState<'single' | 'comparison' | 'grid'>('single');
  const [imageState, setImageState] = useState<ImageState>({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const imageRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSelectedYear(prev => {
          const currentIndex = AVAILABLE_YEARS.indexOf(prev);
          const nextIndex = (currentIndex + 1) % AVAILABLE_YEARS.length;
          return AVAILABLE_YEARS[nextIndex];
        });
      }, playSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playSpeed]);

  const handleZoomIn = () => {
    setImageState(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 5)
    }));
  };

  const handleZoomOut = () => {
    setImageState(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.1)
    }));
  };

  const handleReset = () => {
    setImageState({
      scale: 1,
      translateX: 0,
      translateY: 0
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setImageState(prev => ({
      ...prev,
      translateX: prev.translateX + deltaX,
      translateY: prev.translateY + deltaY
    }));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleImageLoad = (year: number) => {
    setImageLoading(prev => ({ ...prev, [year]: false }));
    setImageErrors(prev => ({ ...prev, [year]: false }));
  };

  const handleImageError = (year: number) => {
    setImageLoading(prev => ({ ...prev, [year]: false }));
    setImageErrors(prev => ({ ...prev, [year]: true }));
  };

  const handleImageLoadStart = (year: number) => {
    setImageLoading(prev => ({ ...prev, [year]: true }));
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const currentIndex = AVAILABLE_YEARS.indexOf(selectedYear);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedYear(AVAILABLE_YEARS[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < AVAILABLE_YEARS.length - 1) {
      setSelectedYear(AVAILABLE_YEARS[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Controls</span>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('single')}
              >
                Single
              </Button>
              <Button
                variant={viewMode === 'comparison' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('comparison')}
              >
                Compare
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Year Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Year: {selectedYear}</label>
            <div className="flex gap-2 flex-wrap">
              {AVAILABLE_YEARS.map(year => (
                <Button
                  key={year}
                  variant={selectedYear === year ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>

          {/* Comparison Year Selection */}
          {viewMode === 'comparison' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Comparison Year: {comparisonYear || 'None'}
              </label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={comparisonYear === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonYear(null)}
                >
                  None
                </Button>
                {AVAILABLE_YEARS.filter(year => year !== selectedYear).map(year => (
                  <Button
                    key={year}
                    variant={comparisonYear === year ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setComparisonYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateYear('prev')}
                disabled={AVAILABLE_YEARS.indexOf(selectedYear) === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateYear('next')}
                disabled={AVAILABLE_YEARS.indexOf(selectedYear) === AVAILABLE_YEARS.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm">Speed:</span>
              <Slider
                value={[2000 - playSpeed]}
                onValueChange={([value]) => setPlaySpeed(2000 - value)}
                max={1500}
                min={200}
                step={100}
                className="flex-1 max-w-32"
              />
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <Badge variant="secondary">
              Zoom: {Math.round(imageState.scale * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Image Viewer */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'single' && (
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-900 min-h-[600px] flex items-center justify-center">
              {imageLoading[selectedYear] && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading {selectedYear}...</span>
                  </div>
                </div>
              )}
              
              {imageErrors[selectedYear] ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-lg font-semibold mb-2">Image Not Available</h3>
                  <p className="text-sm">No urban sprawl data available for {selectedYear}</p>
                </div>
              ) : (
                <div
                  ref={imageRef}
                  className="w-full h-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={getImageUrl(selectedYear)}
                    alt={`Urban sprawl ${selectedYear}`}
                    className="w-full h-auto transition-transform duration-200"
                    style={{
                      transform: `scale(${imageState.scale}) translate(${imageState.translateX}px, ${imageState.translateY}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                    onLoad={() => handleImageLoad(selectedYear)}
                    onError={() => handleImageError(selectedYear)}
                    onLoadStart={() => handleImageLoadStart(selectedYear)}
                  />
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <Badge className="text-lg px-3 py-1">
                  {selectedYear}
                </Badge>
              </div>
            </div>
          )}

          {viewMode === 'comparison' && comparisonYear && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-900 min-h-[400px] flex items-center justify-center">
                {imageErrors[selectedYear] ? (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm">No data for {selectedYear}</p>
                  </div>
                ) : (
                  <img
                    src={getImageUrl(selectedYear)}
                    alt={`Urban sprawl ${selectedYear}`}
                    className="w-full h-auto"
                    style={{
                      transform: `scale(${imageState.scale}) translate(${imageState.translateX}px, ${imageState.translateY}px)`,
                    }}
                    onLoad={() => handleImageLoad(selectedYear)}
                    onError={() => handleImageError(selectedYear)}
                    onLoadStart={() => handleImageLoadStart(selectedYear)}
                  />
                )}
                <Badge className="absolute top-4 left-4">
                  {selectedYear}
                </Badge>
              </div>
              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-900 min-h-[400px] flex items-center justify-center">
                {imageErrors[comparisonYear] ? (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm">No data for {comparisonYear}</p>
                  </div>
                ) : (
                  <img
                    src={getImageUrl(comparisonYear)}
                    alt={`Urban sprawl ${comparisonYear}`}
                    className="w-full h-auto"
                    style={{
                      transform: `scale(${imageState.scale}) translate(${imageState.translateX}px, ${imageState.translateY}px)`,
                    }}
                    onLoad={() => handleImageLoad(comparisonYear)}
                    onError={() => handleImageError(comparisonYear)}
                    onLoadStart={() => handleImageLoadStart(comparisonYear)}
                  />
                )}
                <Badge className="absolute top-4 left-4">
                  {comparisonYear}
                </Badge>
              </div>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {AVAILABLE_YEARS.map(year => (
                <div
                  key={year}
                  className={cn(
                    "relative overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer transition-all hover:scale-105 min-h-32 flex items-center justify-center",
                    selectedYear === year && "ring-2 ring-primary",
                    imageErrors[year] && "opacity-50"
                  )}
                  onClick={() => !imageErrors[year] && setSelectedYear(year)}
                >
                  {imageErrors[year] ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="text-2xl mb-1">📷</div>
                      <p className="text-xs">No data</p>
                    </div>
                  ) : (
                    <>
                      {imageLoading[year] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                      <img
                        src={getImageUrl(year)}
                        alt={`Urban sprawl ${year}`}
                        className="w-full h-auto"
                        onLoad={() => handleImageLoad(year)}
                        onError={() => handleImageError(year)}
                        onLoadStart={() => handleImageLoadStart(year)}
                      />
                    </>
                  )}
                  <Badge className="absolute top-2 left-2 text-xs">
                    {year}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}