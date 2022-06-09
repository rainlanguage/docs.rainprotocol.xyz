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

  build-docs = pkgs.writeShellScriptBin "build-docs" ''
    check-contracts
    npm run build-rain-docs
    npm run build-rain-sdk-docs

    version=`jq .version node_modules/rain-sdk/package.json`; version=''${version:1:-1}
    docusaurus docs:version $version
  '';

  check-contracts = pkgs.writeShellScriptBin "check-contracts" ''
    # Get the Rain Protocol commit in the SDK
    sdkCommit=`jq '.devDependencies."@beehiveinnovation/rain-protocol"' node_modules/rain-sdk/package.json`;
    sdkCommit=''${sdkCommit#*\#}; sdkCommit=''${sdkCommit::-1}

    # Get the current commit used
    currentCommit=`jq '.devDependencies."@beehiveinnovation/rain-protocol"' package.json`;
    currentCommit=''${currentCommit#*\#}; currentCommit=''${currentCommit::-1}

    # If the commits are different, then update it
    if [[ $sdkCommit != $currentCommit ]]; then
       echo "The commit in the SDK is different. Updating..."
       npm install beehive-innovation/rain-protocol.git#''${sdkCommit}
    fi
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
    check-contracts
    build-docs
  ];

  shellHook = ''
    export PATH=$( npm bin ):$PATH
    # keep it fresh
    npm install --verbose --fetch-timeout 3000000
  '';
}
