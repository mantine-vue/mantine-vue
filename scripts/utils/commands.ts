export function commandName(command: string) {
  return process.platform === 'win32' ? `${command}.cmd` : command
}

export function commandInvocation(command: string, args: string[]) {
  if (process.platform === 'win32') {
    return {
      command: process.env.ComSpec ?? 'cmd.exe',
      args: ['/d', '/s', '/c', commandName(command), ...args],
    }
  }

  return { command, args }
}
