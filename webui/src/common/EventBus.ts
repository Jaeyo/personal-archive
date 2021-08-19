

export const publish = (event: string, detail?: any) =>
  document.dispatchEvent(new CustomEvent(event, { detail }))

export const subscribe = (event: string, callback: (data: any) => void) =>
  document.addEventListener(event, e => callback((e as CustomEvent).detail))

export const unsubscribe = (event: string, callback: (data: any) => void) =>
  document.removeEventListener(event, callback)

export const ShowSearchDrawer = 'global.show_search_drawer'
export const ToggleDarkMode = 'global.toggle_dark_mode'
export const ReloadTagTree = 'global.reload_tag_tree'
export const OpenGlobalConfirm = 'global.open_confirm'
export const OpenGlobalPrompt = 'global.open_prompt'
