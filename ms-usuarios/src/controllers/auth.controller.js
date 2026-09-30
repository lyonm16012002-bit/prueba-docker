// CONTROLLER: solo maneja HTTP (lee req, llama al service, responde con res). Sin lógica de negocio.
const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  res.json(authService.login(username, password));
});

const perfil = asyncHandler(async (req, res) => {
  res.json(authService.perfil(req.user));
});

module.exports = { login, perfil };
