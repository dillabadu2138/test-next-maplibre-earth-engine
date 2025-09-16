'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Menu, Square, Triangle, MapPin, Loader2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMapStore } from '@/store/map-store'

interface ControlPanelProps {
  onApply: () => void
}

const years = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
]

export default function ControlPanel({ onApply }: ControlPanelProps) {
  const {
    startYear,
    endYear,
    visParams,
    isLoadingTile,
    isLoadingTimeSeries,
    setStartYear,
    setEndYear,
    setVisParams,
  } = useMapStore()

  const isLoading = isLoadingTile || isLoadingTimeSeries
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>농작물 생산량 모니터링</CardTitle>
        <CardDescription>전 세계의 농작물의 생육 상태를 시기별로 모니터링</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-4">
            {/* 1. 조사 기간 선택 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">1. 조사 기간 선택</Label>
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">시작 년도</Label>
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
                  <Label className="text-xs">종료 년도</Label>
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

            {/* 2. 차트 종류 선택 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">2. 차트 종류 선택</Label>
              <RadioGroup defaultValue="comfortable">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="timeSeries" id="r1" />
                  <Label htmlFor="r1">시계열 분석</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="yearly" id="r2" />
                  <Label htmlFor="r2">연도별 분석</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 3. 그리기 도구 선택 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">3. 그리기 도구 선택</Label>
              <div className="flex flex-col gap-2">
                <Button variant="outline">
                  <Square fill="currentColor" className="text-gray-600" />
                  사각형
                </Button>
                <Button variant="outline">
                  <Triangle fill="currentColor" className="text-red-800" />
                  다각형
                </Button>
                <Button variant="outline">
                  <MapPin className="text-blue-500" />
                  포인트
                </Button>
              </div>
            </div>

            {/* 4. 범례 선택 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">4. 시각화 파라미터 조정</Label>
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">최솟값</Label>
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
                    className="w-20"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">최댓값</Label>
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
