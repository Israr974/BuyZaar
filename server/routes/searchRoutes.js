import express from 'express';
import {
  searchProducts,
  getSearchSuggestions,
  getPopularSearches,
  getSearchFilters,
  getSimilarProducts
} from '../controllers/searchController.js';

const router = express.Router();


router.get('/', searchProducts);


router.get('/suggestions', getSearchSuggestions);


router.get('/popular', getPopularSearches);

router.get('/filters', getSearchFilters);


router.get('/similar', getSimilarProducts);


router.post('/', async (req, res) => {
  try {
    
    const { search, page, limit, ...filters } = req.body;
    
    console.log('🔍 POST search called:', { search, page, limit });
    
   
    const queryParams = {
      q: search || '',
      page: page || 1,
      limit: limit || 12,
      ...filters
    };
    
    
    const mockReq = {
      query: queryParams,
      body: req.body
    };
    
  
    return searchProducts(mockReq, res);
  } catch (error) {
    console.error('POST /api/search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing search request'
    });
  }
});

export default router;