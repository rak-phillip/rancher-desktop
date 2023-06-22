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

package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"

	"github.com/rancher-sandbox/rancher-desktop/src/go/rdctl/pkg/options/generated"
	"github.com/rancher-sandbox/rancher-desktop/src/go/rdctl/pkg/utils"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start up Rancher Desktop, or update its settings.",
	Long: `Starts up Rancher Desktop with the specified settings.
If it's running, behaves the same as 'rdctl set ...'.
`,
	RunE: func(cmd *cobra.Command, args []string) error {
		if err := cobra.NoArgs(cmd, args); err != nil {
			return err
		}
		return doStartOrSetCommand(cmd)
	},
}

var applicationPath string

func init() {
	rootCmd.AddCommand(startCmd)
	options.UpdateCommonStartAndSetCommands(startCmd)
	startCmd.Flags().StringVarP(&applicationPath, "path", "p", "", "Path to main executable.")
}

/**
 * If Rancher Desktop is currently running, treat this like a `set` command, and pass all the args to that.
 */
func doStartOrSetCommand(cmd *cobra.Command) error {
	_, err := getListSettings()
	if err == nil {
		// Unavoidable race condition here.
		// There's no system-wide mutex that will let us guarantee that if rancher desktop is running when
		// we test it (easiest to just try to get the settings), that it will still be running when we
		// try to upload the settings (if any were specified).
		if applicationPath != "" {
			// `--path | -p` is not a valid option for `rdctl set...`
			return fmt.Errorf("--path %s specified but Rancher Desktop is already running", applicationPath)
		}
		err = doSetCommand(cmd)
		if err == nil || cmd.Name() == "set" {
			return err
		}
	}
	// If `set...` failed, try running the original `start` command, if only to give
	// an error message from the point of view of `start` rather than `set`.
	cmd.SilenceUsage = true
	return doStartCommand(cmd)
}

func doStartCommand(cmd *cobra.Command) error {
	commandLineArgs, err := options.GetCommandLineArgsForStartCommand(cmd.Flags())
	if err != nil {
		return err
	}
	if !cmd.Flags().Changed("path") {
		applicationPath, err = utils.GetRDPath()
		if err != nil {
			return fmt.Errorf("failed to locate main Rancher Desktop executable: %w\nplease retry with the --path option", err)
		}
	}
	return launchApp(applicationPath, commandLineArgs)
}

func launchApp(applicationPath string, commandLineArgs []string) error {
	var commandName string
	var args []string

	if runtime.GOOS == "darwin" {
		commandName = "/usr/bin/open"
		args = []string{"-a", applicationPath}
		if len(commandLineArgs) > 0 {
			args = append(args, "--args")
			args = append(args, commandLineArgs...)
		}
	} else {
		commandName = applicationPath
		args = commandLineArgs
	}
	// Include this output because there's a delay before the UI comes up.
	// Without this line, it might look like the command doesn't work.
	logrus.Infof("About to launch %s %s ...\n", commandName, strings.Join(args, " "))
	cmd := exec.Command(commandName, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Start()
}
