let
  pkgs = import
    (builtins.fetchTarball {
      name = "nixos-unstable-2021-10-01";
      url = "https://github.com/nixos/nixpkgs/archive/d3d2c44a26b693293e8c79da0c3e3227fc212882.tar.gz";
      sha256 = "0vi4r7sxzfdaxzlhpmdkvkn3fjg533fcwsy3yrcj5fiyqip2p3kl";
    })
    { };

  prettier-check = pkgs.writeShellScriptBin "prettier-check" ''
    prettier --check .
  '';

  prettier-write = pkgs.writeShellScriptBin "prettier-write" ''
    prettier --write .
  '';

  docs-version = pkgs.writeShellScriptBin "docs-version" ''
    version=`jq .version node_modules/rain-sdk/package.json`; version=''${version:1:-1}
    echo $version
    # docusaurus docs:version $version
  '';

in
pkgs.stdenv.mkDerivation {
  name = "shell";
  buildInputs = [
    pkgs.nixpkgs-fmt
    pkgs.yarn
    pkgs.nodejs-17_x
    pkgs.jq
    prettier-check
    prettier-write
    docs-version 
  ];

  shellHook = ''
    export PATH=$( npm bin ):$PATH
    # keep it fresh
    # npm install --verbose --fetch-timeout 3000000
  '';
}
