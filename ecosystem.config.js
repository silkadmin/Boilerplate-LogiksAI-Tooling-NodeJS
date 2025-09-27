module.exports = {
  apps : [{
    name: 'LAI_TOOLING_Node',
    script: 'node main.js',
    instances : '1',
    env: {
        "NODE_ENV": "production"
    }
  }]
};

