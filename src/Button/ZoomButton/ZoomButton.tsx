import * as React from 'react';

import OlMap from 'ol/Map';
import { easeOut } from 'ol/easing';

import SimpleButton from '../SimpleButton/SimpleButton';
import { CSS_PREFIX } from '../../constants';

interface ZoomButtonDefaultProps {
  /**
   * Whether the zoom in shall be animated.
   */
  animate: boolean;
  /**
   * The delta to zoom when clicked. Defaults to positive `1` essentially zooming-in.
   * Pass negative numbers to zoom out.
   */
  delta: number;
  /**
   * The options for the zoom animation. By default zooming will take 250
   * milliseconds and an easing which starts fast and then slows down will be
   * used.
   */
  animateOptions: {
    duration: number;
    easing: number;
  };
}

export interface ZoomButtonProps extends Partial<ZoomButtonDefaultProps> {
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Instance of OL map this component is bound to.
   */
  map: OlMap;
}

/**
 * Class representing a zoom button.
 *
 * @class The ZoomButton
 * @extends React.Component
 */
class ZoomButton extends React.Component<ZoomButtonProps> {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  _className = `${CSS_PREFIX}zoominbutton`;

  static defaultProps: ZoomButtonDefaultProps = {
    delta: 1,
    animate: true,
    animateOptions: {
      duration: 250,
      easing: easeOut
    }
  };

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick() {
    const {
      map,
      animate,
      animateOptions: {
        duration,
        easing
      },
      delta
    } = this.props;
    const view = map.getView();
    if (!view) { // no view, no zooming
      return;
    }
    if (view.getAnimating()) {
      view.cancelAnimations();
    }
    const currentZoom = view.getZoom();
    const zoom = currentZoom + delta;
    if (animate) {
      const finalOptions = {
        zoom,
        duration,
        easing
      };
      view.animate(finalOptions);
    } else {
      view.setZoom(zoom);
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      delta,
      animate,
      animateOptions,
      map,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this._className}`
      : this._className;

    return (
      <SimpleButton
        className={finalClassName}
        onClick={this.onClick.bind(this)}
        {...passThroughProps}
      />
    );
  }
}

export default ZoomButton;