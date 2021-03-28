import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((pro) => pro.price)
      maxPrice = Math.max(...maxPrice)
      return {...state, all_products: [...action.payload], filter_products: [...action.payload],
      filters:{ ...state.filters, max_price: maxPrice, price: maxPrice }
      }
    case SET_GRIDVIEW:
      return {...state, grid_view: true, }
    case SET_LISTVIEW:
      return {...state, grid_view: false}
    case UPDATE_SORT:
      return {...state, sort: action.payload}    
    case SORT_PRODUCTS:
      const {sort, filter_products} = state
      let tempProducts = [...filter_products]
      if (sort === 'price-lowest') {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price)
      }
      if (sort === 'price-highest') {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price)
      }
      if (sort === 'name-a') {
        tempProducts = tempProducts.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
      }
      if (sort === 'name-z') {
        tempProducts = tempProducts.sort((a, b) => {
          return b.name.localeCompare(a.name)
        })
      }
      return {...state, filter_products: tempProducts}
    case UPDATE_FILTERS:
      const {name, value} = action.payload
      return {...state, filters:{...state.filters, [name]: value}}
    case FILTER_PRODUCTS:
      //---------------------- FILTERING --------------------//
      const { all_products } = state
      const { text, category, company, color, price, shipping } = state.filters

      let tempProduct = [ ...all_products ]
      // TEXT
      if (text) {
        tempProduct = tempProduct.filter((product) => {
          return product.name.startsWith(text)
        })
      }
      // CATEGORY
      if (category !== 'all') {
        tempProduct = tempProduct.filter((product) => product.category === category)
      }
      // COMPANY
      if (company !== 'all') {
        tempProduct = tempProduct.filter((product) => product.company === company)
      }
      // COLOR
      if (color !== 'all') {
        tempProduct = tempProduct.filter((product) => {
          return product.colors.find((col) => col === color)
        })
      }
      // PRICE
      if (price) {
        tempProduct = tempProduct.filter((product) => product.price <= price)
      }
      // SHIPPING
      if (shipping) {
        tempProduct = tempProduct.filter((product) => product.shipping === true)
      }
      return { ...state, filter_products: tempProduct }
    case CLEAR_FILTERS:
      return {...state, filters: {
    ...state.filters,
    text: '',
    company: 'all',
    category: 'all',
    color: 'all',
    price: state.filters.max_price,
    shipping: false,
  }}      
    default:
      throw new Error(`No Matching "${action.type}" - action type`)
    }
}

export default filter_reducer
