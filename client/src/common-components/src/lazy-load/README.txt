## Component dùng để ngắt load tài nguyên nếu tài nguyên đó chưa nằm trong phần màn hình


## HƯỚNG DẪN SỬ DỤNG

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoadComponent from '../../common-component/index;
import MyComponent from './MyComponent';

render() {
    return (
        <div className="list">
            <LazyLoadComponent
                /** Các props ... **/
            >
                <MyComponent />
            </LazyLoadComponent>
        </div>
    );
};

```


## PROPS

### children

    Type: Node, Default: undefined

    **NOTICE**
    Only one child is allowed to be passed.

### scrollContainer

    Type: String/DOM node, Default: undefined

    Pass a query selector string or DOM node. LazyLoad will attach to the window object's scroll events if no container is passed.

### height

    Type: Number/String,  Default: undefined

    Chiều cao của placeholder

### once

    Type: Bool,  Default: false

    Set 'true', sau khi load xong, sẽ k bắt sự kiện scroll hoặc resize nữa

### offset

    Type: Number/Array(Number), Default: 0

    Say if you want to preload a component even if it's 100px below the viewport (user have to scroll 100px more to see this component), you can set `offset` props to `100`. On the other hand, if you want to delay loading a component even if it's top edge has already appeared at viewport, set `offset` to negative number.

    Library supports horizontal lazy load out of the box. So when you provide this prop with number like `100` it will automatically set left edge offset to `100` and top edge to `100`;

    If you provide this prop with array like `[100, 200]`, it will set left edge offset to `100` and top offset to `200`.

### scroll

    Type: Bool, Default: true

    Bắt sự kiện scroll
### resize

    Type: Bool, Default: false

    Set 'true' để bắt sự kiện resize
### overflow

    Type: Bool, Default: false

    If lazy loading components inside a overflow container, set this to `true`. Also make sure a `position` property other than `static` has been set to your overflow container.

### placeholder
    Trình giữ chỗ cho thành phần lazy load

### unmountIfInvisible

    Type: Bool, Default: false

    Set 'true', component sẽ quay lại trạng thái lazy load khi k còn hiện trên màn hình

### debounce/throttle

    Type: Bool / Number, Default: undefined

    Giúp tự mình kiểm soát sự kiện cuộn hoặc resize
    Nếu là Number, sẽ delay bấy nhiên 'ms'. Nếu set 'true', mặc định delay '300ms'

### classNamePrefix

    Type: String Default: `lazyload`

    While rendering, Lazyload will add some elements to the component tree in addition to the wrapped component children.

    The `classNamePrefix` prop allows the user to supply their own custom class prefix to help:
        # Avoid class conflicts on an implementing app
        # Allow easier custom styling

    These being:
        # A wrapper div, which is present at all times (default )

### wheel

    **DEPRECATED NOTICE**
    This props is not supported anymore, try set `overflow` for lazy loading in overflow containers.




## UTILITY

### forceCheck

    Nếu component đã ở trong viewport, bắt buộc hiện mà k cần sự kiện scroll hoặc resize

    Import `forceCheck`:

    ```javascript
    import { forceCheck } from 'react-lazyload';
    ```

    Then call the function:

    ```javascript
    forceCheck();
    ```

### forceVisible

    Buộc component load dù ở trong viewport hay ko

    ```javascript
    import { forceVisible } from 'react-lazyload';
    ```

    Then call the function:

    ```javascript
    forceVisible();
    ```



