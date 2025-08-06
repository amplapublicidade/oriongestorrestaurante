const { validationResult } = require('express-validator');

/**
 * Middleware para validação rigorosa de dados
 * Rejeita campos inesperados para prevenir ataques de poluição de parâmetros
 */
const strictValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }

  // Verificar se há campos inesperados no corpo da requisição
  const allowedFields = req.allowedFields || [];
  const bodyFields = Object.keys(req.body);
  const unexpectedFields = bodyFields.filter(field => !allowedFields.includes(field));
  
  if (unexpectedFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Campos inesperados detectados',
      errors: unexpectedFields.map(field => ({
        field,
        message: `Campo '${field}' não é permitido`
      }))
    });
  }

  next();
};

/**
 * Middleware para sanitização de dados
 */
const sanitizeData = (req, res, next) => {
  // Remover espaços em branco desnecessários
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitizar parâmetros de query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
};

module.exports = {
  strictValidation,
  sanitizeData
}; 