import * as Mui from '@material-ui/core';
import { MediaElement } from 'face-api.js-react';
import * as React from 'react';
import styled from 'styled-components';

import { ImageWithOverlay } from '../../face-api.js-react';
import { SideBySide } from '../styled/SideBySide';
import { ImageSelection, ImageSelectionItem } from './ImageSelection';

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Margin = styled.div`
  margin: 10px;
`


export enum SelectionTypes {
  SELECT = 'SELECT',
  FILE = 'FILE',
  BOTH = 'BOTH'
}

export type SelectableImageProps = {
  onLoaded: (refs: { img: MediaElement, overlay: HTMLCanvasElement}) => any
  imgId: string
  items?: ImageSelectionItem[]
  initialImageSrc?: string
  selectionType?: SelectionTypes
  imageStyle?: React.CSSProperties
}

export type SelectableImageState = {
  imageSrc: string
}

export class SelectableImage extends React.Component<SelectableImageProps, SelectableImageState> {
  static defaultProps: Partial<SelectableImageProps> = {
    selectionType: SelectionTypes.SELECT
  }

  constructor(props: SelectableImageProps) {
    super(props)

    this.state = {
      imageSrc: props.initialImageSrc
    }

    this.onChangeSelection = this.onChangeSelection.bind(this)
    this.onLoadFromDisk = this.onLoadFromDisk.bind(this)
  }

  onChangeSelection(imageSrc: string) {
    this.setState({
      imageSrc
    })
  }

  onLoadFromDisk(e: any) {
    const file = (e.target.files || [])[0]
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = (loadEvent: any) =>
    this.setState({
      imageSrc: loadEvent.target.result
    })

    reader.readAsDataURL(e.target.files[0])
  }

  render() {
    const { selectionType } = this.props
    return (
      <Container>
        <ImageWithOverlay
          {...this.props}
          imageSrc={this.state.imageSrc}
          imageStyle={this.props.imageStyle}
        />
        <SideBySide>
        {
          (selectionType === SelectionTypes.SELECT || selectionType === SelectionTypes.BOTH)
            &&
            <Margin>
              <ImageSelection
                items={this.props.items}
                selectedImage={this.state.imageSrc}
                onChange={this.onChangeSelection}
              />
            </Margin>
        }
        {
          (selectionType === SelectionTypes.FILE || selectionType === SelectionTypes.BOTH)
            &&
            <Margin>
              <input
                accept="image/*"
                id={this.props.imgId}
                multiple
                style={{ display: 'none' }}
                onChange={this.onLoadFromDisk}
                type="file"
              />
              <label htmlFor={this.props.imgId}>
                <Mui.Button variant="outlined" component="span">
                  From Disk
                </Mui.Button>
              </label>
            </Margin>
        }
        </SideBySide>
      </Container>
    )
  }
}