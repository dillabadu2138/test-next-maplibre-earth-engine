'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Pentagon, MapPin, Loader2 } from 'lucide-react'
import { useMapStore } from '@/store/map-store'

interface ControlPanelProps {
  onApply: () => void
}

export default function ControlPanel({ onApply }: ControlPanelProps) {
  const {
    startYear,
    endYear,
    visParams,
    isLoadingTile,
    isLoadingTimeSeries,
    drawingMode,
    setStartYear,
    setEndYear,
    setVisParams,
    setDrawingMode,
  } = useMapStore()

  const isLoading = isLoadingTile || isLoadingTimeSeries
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>농작물 생산량 모니터링</CardTitle>
        <CardDescription>전세계 농작물 생육 상태 모니터링</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-4">
            {/* 1. 조사 기간 선택 */}
            <div className="space-y-2">
              <Label className="text-md font-medium">조사 기간 선택</Label>
              <div className="flex gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">시작년도</Label>
                  <Input
                    type="number"
                    value={startYear}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (!isNaN(value)) {
                        setStartYear(value)
                      }
                    }}
                    className="w-24"
                    min={2000}
                    max={2024}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">종료년도</Label>
                  <Input
                    type="number"
                    value={endYear}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (!isNaN(value)) {
                        setEndYear(value)
                      }
                    }}
                    className="w-24"
                    min={2000}
                    max={2024}
                  />
                </div>
              </div>
            </div>

            {/* 차트 종류 선택 */}
            <div className="space-y-2">
              <Label className="text-md font-medium">분석 차트 종류 선택</Label>
              <RadioGroup defaultValue="comfortable" className="flex gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="timeSeries" id="r1" />
                  <Label htmlFor="r1">시계열</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yearly" id="r2" />
                  <Label htmlFor="r2">연도별</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 그리기 모드 선택 */}
            <div className="space-y-2">
              <Label className="text-md font-medium">그리기 모드 선택</Label>
              <p className="text-xs text-muted-foreground">
                Esc 키로 그리기 모드에서 나갈 수 있습니다
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={drawingMode === 'polygon' ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDrawingMode('polygon')
                  }}
                  disabled={isLoading}
                >
                  <Pentagon stroke="currentColor" className="text-green-600" />
                  다각형
                </Button>

                <Button
                  type="button"
                  variant={drawingMode === 'point' ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDrawingMode('point')
                  }}
                  disabled={isLoading}
                >
                  <MapPin stroke="currentColor" className="text-yellow-600" />
                  포인트
                </Button>
              </div>
            </div>

            {/* 시각화 파라미터 조정 */}
            <div className="space-y-2">
              <Label className="text-md font-medium">시각화 파라미터 조정</Label>
              <div className="flex gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">최솟값</Label>
                  <Input
                    id="minVal"
                    type="number"
                    value={visParams.min}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      if (!isNaN(value)) {
                        setVisParams({ ...visParams, min: value })
                      }
                    }}
                    step={0.1}
                    min={0}
                    className="w-20"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">최댓값</Label>
                  <Input
                    id="maxVal"
                    type="number"
                    value={visParams.max}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      if (!isNaN(value)) {
                        setVisParams({ ...visParams, max: value })
                      }
                    }}
                    step={0.1}
                    min={0.1}
                    max={1}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button type="button" onClick={onApply} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              로딩 중...
            </>
          ) : (
            '적용'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
