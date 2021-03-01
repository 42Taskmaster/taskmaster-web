import { inject, provide, readonly, Ref, ref } from 'vue'

const SidebarIsOpenSymbol = Symbol('SidebarIsOpenSymbol')
const SidebarToggleIsOpenSymbol = Symbol('SidebarToggleIsOpenSymbol')
const SidebarSetIsOpenSymbol = Symbol('SidebarSetIsOpenSymbol')

type SidebarIsOpenProvided = Readonly<Ref<boolean>>
type SidebarToggleIsOpenProvided = () => void
type SidebarSetIsOpenProvided = (state: boolean) => void

export function useSidebarProvider() {
  const isOpen = ref<boolean>(false)

  function toggleIsOpen() {
    isOpen.value = !isOpen.value
  }

  function setIsOpen(state: boolean) {
    isOpen.value = state
  }

  provide<SidebarIsOpenProvided>(SidebarIsOpenSymbol, readonly(isOpen))
  provide<SidebarToggleIsOpenProvided>(SidebarToggleIsOpenSymbol, toggleIsOpen)
  provide<SidebarSetIsOpenProvided>(SidebarSetIsOpenSymbol, setIsOpen)

  return {
    setIsOpen
  }
}

export function useSidebar() {
  const isOpen = inject<SidebarIsOpenProvided>(SidebarIsOpenSymbol)
  const toggleIsOpen = inject<SidebarToggleIsOpenProvided>(SidebarToggleIsOpenSymbol)
  const setIsOpen = inject<SidebarSetIsOpenProvided>(SidebarSetIsOpenSymbol)

  if (isOpen === undefined || toggleIsOpen === undefined || setIsOpen === undefined)
    throw new Error('useSidebarProvider must be called before useSidebar')

  return {
    isOpen,
    toggleIsOpen,
    setIsOpen,
  }
}
