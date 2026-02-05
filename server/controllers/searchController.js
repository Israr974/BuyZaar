

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';


export const searchProducts = async (req, res) => {
  try {
    const { 
      q = '', 
      page = 1, 
      limit = 12, 
      sortBy = 'relevance',
      category = '',
      minPrice = '',
      maxPrice = '',
      inStock = ''
    } = req.query;

    console.log(' Search query:', { q, page, limit, sortBy, category });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

   
    let query = { publish: true };

    if (q && q.trim()) {
      query.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } }
      ];
    }

   
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (category) {
      query.category = category;
    }

   
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    
    let sort = {};
    switch(sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'discount':
        sort = { discount: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }


    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name')
      .populate({
        path: 'sub_category',
        select: 'name image',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .lean();

   
    const total = await Product.countDocuments(query);

    console.log(`Found ${products.length} products out of ${total}`);

    
    const categories = await Category.find().select('name').lean();


    const enhancedProducts = products.map(product => ({
      ...product,
      finalPrice: product.price - (product.price * ((product.discount || 0) / 100))
    }));

    res.json({
      success: true,
      message: products.length > 0 ? 'Products found' : 'No products found',
      data: enhancedProducts,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum < Math.ceil(total / limitNum)
      },
      filters: {
        availableCategories: categories
      }
    });

  } catch (error) {
    console.error(' Search error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { q = '' } = req.query;

    if (!q.trim()) {
      return res.json({
        success: true,
        data: {
          products: [],
          categories: [],
          suggestions: []
        }
      });
    }

  
    const products = await Product.find({
      publish: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name image price discount')
    .limit(5)
    .lean();

 
    const categories = await Category.find({
      name: { $regex: q, $options: 'i' }
    })
    .select('name')
    .limit(3)
    .lean();

  
    const enhancedProducts = products.map(product => ({
      ...product,
      finalPrice: product.price - (product.price * (product.discount / 100))
    }));

  
    const suggestions = [
      `${q}`,
      `${q} sale`,
      `buy ${q}`,
      `${q} online`,
      `cheap ${q}`
    ];

    res.json({
      success: true,
      data: {
        products: enhancedProducts,
        categories,
        suggestions
      }
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting search suggestions'
    });
  }
};


export const getPopularSearches = async (req, res) => {
  try {
    
    const popularSearches = [
      { term: 'Smartphones', count: 1250 },
      { term: 'Laptops', count: 980 },
      { term: 'Headphones', count: 750 },
      { term: 'Smart Watches', count: 620 },
      { term: 'Gaming', count: 580 },
      { term: 'Home Decor', count: 520 },
      { term: 'Fitness', count: 480 },
      { term: 'Kitchen Appliances', count: 450 }
    ];

    res.json({
      success: true,
      data: popularSearches
    });

  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting popular searches'
    });
  }
};


export const getSearchFilters = async (req, res) => {
  try {
    const { q = '' } = req.query;

    let query = { publish: true };
    if (q.trim()) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    
    const priceStats = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $match: {
          'products': { $exists: true, $ne: [] }
        }
      },
      {
        $project: {
          name: 1,
          count: { $size: '$products' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        priceRange: priceStats[0] || { 
          minPrice: 0, 
          maxPrice: 1000, 
          avgPrice: 500 
        },
        categories
      }
    });

  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting search filters'
    });
  }
};


export const getSimilarProducts = async (req, res) => {
  try {
    const { productId, limit = 4 } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const similarProducts = await Product.find({
      _id: { $ne: productId },
      category: product.category,
      publish: true
    })
    .select('name image price discount stock')
    .limit(parseInt(limit))
    .lean();


    const enhancedProducts = similarProducts.map(p => ({
      ...p,
      finalPrice: p.price - (p.price * (p.discount / 100))
    }));

    res.json({
      success: true,
      data: enhancedProducts
    });

  } catch (error) {
    console.error('Similar products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting similar products'
    });
  }
};
