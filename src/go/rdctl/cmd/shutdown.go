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
	"github.com/spf13/cobra"
)

// shutdownCmd represents the shutdown command
var shutdownCmd = &cobra.Command{
	Use:   "shutdown",
	Short: "Shuts down the running Rancher Desktop application",
	Long:  `Shuts down the running Rancher Desktop application.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		err := cobra.NoArgs(cmd, args)
		if err != nil {
			return err
		}
		result, err := processRequestForUtility(doRequest("PUT", versionCommand("", "shutdown")))
		if err != nil {
			return err
		}
		fmt.Println(string(result))
		return nil
	},
}

func init() {
	rootCmd.AddCommand(shutdownCmd)
}
