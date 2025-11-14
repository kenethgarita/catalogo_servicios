export const requireRol = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para esta acción" });
    }

    const userRole = req.user.rol.toLowerCase(); //normaliza el rol del usuario
    const normalizedRoles = allowedRoles.map((r) => r.toLowerCase()); //normaliza los permitidos

    if (!normalizedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para esta acción" });
    }

    next();
  };
};
