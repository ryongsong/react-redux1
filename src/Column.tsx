import React, { useState } from 'react'
import styled from 'styled-components'
import * as color from './color'
import { Card } from './Card'
import { PlusIcon } from './icon'
import { InputForm as _InputForm } from './InputForm'

export function Column({
  title,
  filterValue: rawFilterValue,
  cards: rawCards,
  onCardDragStart,
  onCardDrop,
  onCardDeleteClick,
  text,
  onTextChange,
  onTextConfirm,
  onTextCancel,
}: {
  title?: string
  filterValue?: string
  cards?: {
    id: string
    text?: string
  }[]
  onCardDragStart?(id: string): void
  onCardDrop?(entered: string | null): void
  onCardDeleteClick?(id: string): void
  text?: string
  onTextChange?(value: string): void
  onTextConfirm?(): void
  onTextCancel?(): void
}) {
  const filterValue = rawFilterValue?.trim()
  const keywords = filterValue?.toLowerCase().split(/\s+/g) ?? []
  const cards = rawCards?.filter(({ text }) =>
    keywords?.every(w => text?.toLowerCase().includes(w)),
  )
  const totalCount = rawCards?.length ?? -1

  const [inputMode, setInputMode] = useState(false)
  const toggleInput = () => setInputMode(v => !v)
  const confirmInput = () => {
    onTextConfirm?.()
  }
  const cancelInput = () => {
    setInputMode(false)
    onTextCancel?.()
  }

  const [draggingCardID, setDraggingCardID] = useState<string | undefined>(
    undefined,
  )
  const handleCardDragStart = (id: string) => {
    setDraggingCardID(id)
    onCardDragStart?.(id)
  }

  return (
    <Container>
      <Header>
        {totalCount >= 0 && <CountBadge>{totalCount}</CountBadge>}
        <ColumnName>{title}</ColumnName>

        <AddButton onClick={toggleInput} />
      </Header>

      {inputMode && (
        <InputForm
          value={text}
          onChange={onTextChange}
          onConfirm={confirmInput}
          onCancel={cancelInput}
        />
      )}

      {!cards ? (
        <Loading />
      ) : (
        <>
          {filterValue && <ResultCount>{cards.length} results</ResultCount>}

          <VerticalScroll>
            {cards.map(({ id, text }, i) => (
              <Card.DropArea
                key={id}
                disabled={
                  draggingCardID !== undefined &&
                  (id === draggingCardID || cards[i - 1]?.id === draggingCardID)
                }
                onDrop={() => onCardDrop?.(id)}
              >
                <Card
                  text={text}
                  onDragStart={() => handleCardDragStart(id)}
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
              onDrop={() => onCardDrop?.(null)}
            />
          </VerticalScroll>
        </>
      )}
    </Container>
  )
}

const InputForm = styled(_InputForm)`
padding: 8px;
`

const Loading = styled.div.attrs({
children: 'Loading...',
})`
padding: 8px;
font-size: 14px;
`

const ResultCount = styled.div`
color: ${color.Black};
font-size: 12px;
text-align: center;
`
