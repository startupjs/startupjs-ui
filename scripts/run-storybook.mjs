import os from 'node:os'

const originalNetworkInterfaces = os.networkInterfaces

os.networkInterfaces = function networkInterfacesWithLoopbackFallback () {
  try {
    return originalNetworkInterfaces.call(os)
  } catch (err) {
    if (err?.code !== 'ERR_SYSTEM_ERROR' && err?.syscall !== 'uv_interface_addresses') {
      throw err
    }

    return {
      lo: [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.1/8'
        },
        {
          address: '::1',
          netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
          family: 'IPv6',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '::1/128',
          scopeid: 0
        }
      ]
    }
  }
}

await import('../node_modules/storybook/dist/bin/dispatcher.js')
