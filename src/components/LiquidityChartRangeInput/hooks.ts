import { Currency } from '@cykura/sdk-core'
import { FeeAmount } from '@cykura/sdk'
import { TickProcessed, usePoolActiveLiquidity } from 'hooks/usePoolTickData'
import { useCallback, useMemo } from 'react'

import { ChartEntry } from './types'

export function useDensityChartData({
  currencyA,
  currencyB,
  feeAmount,
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  feeAmount: FeeAmount | undefined
}) {
  const { isLoading, isUninitialized, isError, error, data } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount)

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined
    }

    const newData: ChartEntry[] = []

    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return newData
  }, [data])

  return useMemo(() => {
    return {
      isLoading,
      isUninitialized,
      isError,
      error,
      formattedData: !isLoading && !isUninitialized ? formatData() : undefined,
    }
  }, [isLoading, isUninitialized, isError, error, formatData])
}
