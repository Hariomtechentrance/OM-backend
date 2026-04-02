import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export const supabaseHelpers = {
  // Authentication
  auth: {
    signUp: async (email, password, metadata = {}) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      })
      return { data, error }
    },
    
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    },
    
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      return { error }
    },
    
    getCurrentUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    },
    
    onAuthStateChange: (callback) => {
      return supabase.auth.onAuthStateChange(callback)
    }
  },

  // Products
  products: {
    getAll: async (filters = {}) => {
      let query = supabase.from('products').select('*')
      
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      return { data, error }
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },
    
    create: async (product) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
      return { data, error }
    },
    
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Orders
  orders: {
    create: async (order) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
      return { data, error }
    },
    
    getByUser: async (userId) => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },
    
    updateStatus: async (id, status) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
      return { data, error }
    }
  },

  // Cart
  cart: {
    getByUser: async (userId) => {
      const { data, error } = await supabase
        .from('cart')
        .select('*, products(*)')
        .eq('user_id', userId)
      return { data, error }
    },
    
    addItem: async (item) => {
      const { data, error } = await supabase
        .from('cart')
        .insert([item])
        .select()
      return { data, error }
    },
    
    updateItem: async (id, updates) => {
      const { data, error } = await supabase
        .from('cart')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },
    
    removeItem: async (id) => {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', id)
      return { error }
    },
    
    clearCart: async (userId) => {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
      return { error }
    }
  },

  // File Upload
  storage: {
    uploadImage: async (file, path) => {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file)
      return { data, error }
    },
    
    getPublicUrl: (path) => {
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(path)
      return data.publicUrl
    }
  }
}

export default supabase
