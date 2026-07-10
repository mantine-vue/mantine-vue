import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useWindowEvent } from '../use-window-event/use-window-event'

export interface UserNetworkReturnValue {
  online: boolean
  downlink?: number
  downlinkMax?: number
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  rtt?: number
  saveData?: boolean
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown'
}

interface NetworkConnection extends EventTarget {
  downlink?: number
  downlinkMax?: number
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  rtt?: number
  saveData?: boolean
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown'
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection
  mozConnection?: NetworkConnection
  webkitConnection?: NetworkConnection
}

function getConnection(): Omit<UserNetworkReturnValue, 'online'> {
  if (typeof navigator === 'undefined') {
    return {}
  }

  const nav = navigator as NavigatorWithConnection
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection

  if (!connection) {
    return {}
  }

  return {
    downlink: connection.downlink,
    downlinkMax: connection.downlinkMax,
    effectiveType: connection.effectiveType,
    rtt: connection.rtt,
    saveData: connection.saveData,
    type: connection.type,
  }
}

export function useNetwork(): Ref<UserNetworkReturnValue> {
  const status = ref<UserNetworkReturnValue>({ online: true }) as Ref<UserNetworkReturnValue>

  const handleConnectionChange = (): void => {
    status.value = { ...status.value, ...getConnection() }
  }

  useWindowEvent('online', () => {
    status.value = { online: true, ...getConnection() }
  })
  useWindowEvent('offline', () => {
    status.value = { online: false, ...getConnection() }
  })

  onMounted(() => {
    const nav = navigator as NavigatorWithConnection

    if (nav.connection) {
      status.value = { online: nav.onLine, ...getConnection() }
      nav.connection.addEventListener('change', handleConnectionChange)
      return
    }

    if (typeof nav.onLine === 'boolean') {
      status.value = { ...status.value, online: nav.onLine }
    }
  })

  onBeforeUnmount(() => {
    const nav = navigator as NavigatorWithConnection
    nav.connection?.removeEventListener('change', handleConnectionChange)
  })

  return status
}
