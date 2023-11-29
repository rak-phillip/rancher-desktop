/*
Copyright © 2022 SUSE LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Package config handles all the config-related parts of rdctl
package config

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/rancher-sandbox/rancher-desktop/src/go/rdctl/pkg/paths"
	"github.com/spf13/cobra"
)

// ConnectionInfo stores the parameters needed to connect to an HTTP server
type ConnectionInfo struct {
	User     string
	Password string
	Host     string
	Port     int
}

var (
	connectionSettings ConnectionInfo

	configPath string
	// DefaultConfigPath - used to differentiate not being able to find a user-specified config file from the default
	DefaultConfigPath string
)

// DefineGlobalFlags sets up the global flags, available for all sub-commands
func DefineGlobalFlags(rootCmd *cobra.Command) {
	var configDir string
	var err error
	if runtime.GOOS == "linux" && isWSLDistro() {
		if configDir, err = wslifyConfigDir(); err != nil {
			log.Fatalf("Can't get WSL config-dir: %v", err)
		}
		configDir = filepath.Join(configDir, "rancher-desktop")
	} else {
		appPaths, err := paths.GetPaths()
		if err != nil {
			log.Fatalf("failed to get paths: %s", err)
		}
		configDir = appPaths.AppHome
	}
	DefaultConfigPath = filepath.Join(configDir, "rd-engine.json")
	rootCmd.PersistentFlags().StringVar(&configPath, "config-path", "", fmt.Sprintf("config file (default %s)", DefaultConfigPath))
	rootCmd.PersistentFlags().StringVar(&connectionSettings.User, "user", "", "overrides the user setting in the config file")
	rootCmd.PersistentFlags().StringVar(&connectionSettings.Host, "host", "", "default is 127.0.0.1; most useful for WSL")
	rootCmd.PersistentFlags().IntVar(&connectionSettings.Port, "port", 0, "overrides the port setting in the config file")
	rootCmd.PersistentFlags().StringVar(&connectionSettings.Password, "password", "", "overrides the password setting in the config file")
}

// GetConnectionInfo returns the connection details of the application API server.
// As a special case this function may return a nil *ConnectionInfo and nil error
// when the config file has not been specified explicitly, the default config file
// does not exist, and the mayBeMissing parameter is true.
func GetConnectionInfo(mayBeMissing bool) (*ConnectionInfo, error) {
	var settings ConnectionInfo

	if configPath == "" {
		configPath = DefaultConfigPath
	}
	content, readFileError := os.ReadFile(configPath)
	if readFileError != nil {
		// It is ok if the default config path doesn't exist; the user may have specified the required settings on the commandline.
		// But it is an error if the file specified via --config-path can not be read.
		if configPath != DefaultConfigPath || !errors.Is(readFileError, os.ErrNotExist) {
			return nil, readFileError
		}
	} else if err := json.Unmarshal(content, &settings); err != nil {
		return nil, fmt.Errorf("error parsing config file %q: %w", configPath, err)
	}

	fmt.Printf("Host value: %s\n", connectionSettings.Host)
	if connectionSettings.Host == "" {
		fmt.Printf("Updating host value: %s\n", settings.Host)
		connectionSettings.Host = settings.Host
		if connectionSettings.Host == "" {
			connectionSettings.Host = "127.0.0.1"
		}
	}

	fmt.Printf("User value: %s\n", connectionSettings.User)
	if connectionSettings.User == "" {
		fmt.Printf("Updating user value: %s\n", settings.User)
		connectionSettings.User = settings.User
	}

	fmt.Printf("Password value: %s\n", connectionSettings.Password)
	if connectionSettings.Password == "" {
		fmt.Printf("Updating password value: %s\n", settings.Password)
		connectionSettings.Password = settings.Password
	}

	fmt.Printf("Port value: %s\n", connectionSettings.Port)
	if connectionSettings.Port == 0 {
		fmt.Printf("Updating port value: %s\n", settings.Port)
		connectionSettings.Port = settings.Port
	}
	if connectionSettings.Port == 0 || connectionSettings.User == "" || connectionSettings.Password == "" {
		// Missing the default config file may or may not be considered an error
		if readFileError != nil {
			if mayBeMissing {
				readFileError = nil
			}
			return nil, readFileError
		}
		return nil, errors.New("insufficient connection settings (missing one or more of: port, user, and password)")
	}

	return &connectionSettings, nil
}

// determines if we are running in a wsl linux distro
// by checking for availability of wslpath and see if it's a symlink
func isWSLDistro() bool {
	fi, err := os.Lstat("/bin/wslpath")
	if os.IsNotExist(err) {
		return false
	}
	return fi.Mode()&os.ModeSymlink == os.ModeSymlink
}

func getLocalAppDataPath() (string, error) {
	var outBuf bytes.Buffer
	// changes the codepage to 65001 which is UTF-8
	subCommand := `chcp 65001 >nul & echo %LOCALAPPDATA%`
	cmd := exec.Command("cmd.exe", "/c", subCommand)
	cmd.Stdout = &outBuf
	// We are intentionally not using CombinedOutput and
	// excluding the stderr since it could contain some
	// warnings when rdctl is triggered from a non WSL mounted directory
	if err := cmd.Run(); err != nil {
		return "", err
	}
	return strings.TrimRight(outBuf.String(), "\r\n"), nil
}

func wslifyConfigDir() (string, error) {
	path, err := getLocalAppDataPath()
	if err != nil {
		return "", err
	}
	var outBuf bytes.Buffer
	cmd := exec.Command("/bin/wslpath", path)
	cmd.Stdout = &outBuf
	if err = cmd.Run(); err != nil {
		return "", err
	}
	return strings.TrimRight(outBuf.String(), "\r\n"), err
}
