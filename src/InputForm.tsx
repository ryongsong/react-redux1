import React,{useRef,useEffect}from'react'
import styled from 'styled-components'
import * as color from './color'
import { Button, ConfirmButton } from './Button'

export function InputForm({
  value,
  onChange,
  onConfirm,
  onCancel,
  className,
}: {
  value?:string
  onChange?(value:string):void
  onConfirm?():void
  onCancel?(): void
  className?: string
}) {

  const disabled = !value?.trim()
  const handleConfirm = () => {
    if (disabled) return
    onConfirm?.()
  }

const ref = useAutoFitToContentHeight(value)

  return (
    <Container className={className}>
      <Input
        ref={ref}
        autoFocus
        placeholder="Enter a note"
        value={value}
        onChange={ev => onChange?.(ev.currentTarget.value)}
        onKeyDown={ev => {
          if (!((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter')) return
          handleConfirm()
        }}
      />

      <ButtonRow>
        <AddButton disabled={disabled} onClick={handleConfirm} />
        <CancelButton onClick={onCancel} />
      </ButtonRow>
    </Container>
  )
}

 /**
  * テキストエリアの高さを内容に合わせて自動調整する
  *
  * @param content テキストエリアの内容
  */
 function useAutoFitToContentHeight(content: string | undefined) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(
    () => {
      const el = ref.current
      if (!el) return

      const { borderTopWidth, borderBottomWidth } = getComputedStyle(el)
      el.style.height = 'auto' // 一度 auto にしないと高さが縮まなくなる
      el.style.height = `calc(${borderTopWidth} + ${el.scrollHeight}px + ${borderBottomWidth})`
    },
    // 内容が変わるたびに高さを再計算
    [content],
  )

  return ref
}
