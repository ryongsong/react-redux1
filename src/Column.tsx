import React, { useState } from 'react'
import styled from 'styled-components'
import * as color from './color'
import { Card } from './Card'
import { PlusIcon } from './icon'
import { InputForm as _InputForm } from './inputForm'

export function Column({
  title,
  filterValue: rawFilterValue,
  cards: rawCards,
  onCardDragStart,
  onCardDrop,
  onCardDeleteClick,
}: {
  title?: string
  filterValue?: string
  cards: {
    id: string
    text?: string
  }[]
  onCardDragStart?(id: string): void
  onCardDrop?(entered: string | null): void
  onCardDeleteClick?(id: string): void
}) {
  const filterValue = rawFilterValue?.trim()
  const keywords = filterValue?.toLowerCase().split(/\s+/g) ?? []
  const cards = rawCards.filter(({ text }) =>
    keywords?.every(w => text?.toLowerCase().includes(w)),
  )
  const totalCount = rawCards.length

  const [text, setText] = useState('')

  const [inputMode, setInputMode] = useState(false)
  const toggleInput = () => setInputMode(v => !v)
  const confirmInput = () => setText('')
  const cancelInput = () => setInputMode(false)

  const [draggingCardID, setDraggingCardID] = useState<string | undefined>(
    undefined,
  )

  return (
    <Container>
      <Header>
        <CountBadge>{totalCount}</CountBadge>
        <ColumnName>{title}</ColumnName>

        <AddButton onClick={toggleInput} />
      </Header>

      {inputMode && (
        <InputForm
          value={text}
          onChange={setText}
          onConfirm={confirmInput}
          onCancel={cancelInput}
        />
      )}

      {filterValue && <ResultCount>{cards.length} results</ResultCount>}

      <VerticalScroll>
        {cards.map(({ id, text }, i) => (
          <Card.DropArea
            key={id}
            disabled={
              draggingCardID !== undefined &&
              (id === draggingCardID || cards[i - 1]?.id === draggingCardID)
            }
          >
            <Card
              text={text}
              onDragStart={() => setDraggingCardID(id)}
              onDragEnd={() => setDraggingCardID(undefined)}
              onDeleteClick={() => onCardDeleteClick?.(id)}
            />
          </Card.DropArea>
        ))}

        <Card.DropArea
          style={{ height: '100%' }}
          disabled={
            draggingCardID !== undefined &&
            cards[cards.length - 1]?.id === draggingCardID
          }
        />
      </VerticalScroll>
    </Container>
  )
}

