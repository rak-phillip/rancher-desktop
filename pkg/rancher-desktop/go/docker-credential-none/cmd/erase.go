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
	"github.com/spf13/cobra"
)

var eraseCmd = &cobra.Command{
	Use:   "erase",
	Short: "Delete the credentials associated with the URL written to stdin.",
	Long:  "Delete the credentials associated with the URL written to stdin. This action is idempotent: behavior is the same whether the URL is found or not.",
	RunE: func(cmd *cobra.Command, args []string) error {
		cmd.SilenceUsage = true
		return doErase()
	},
}

func init() {
	rootCmd.AddCommand(eraseCmd)
}

func doErase() error {
	config, err := getParsedConfig()
	if err != nil {
		return err
	}
	url := getStandardInput()
	authsInterface, ok := config["auths"]
	if !ok {
		// Not an error if there's no URL (or auths)
		return nil
	}
	auths, ok := authsInterface.(map[string]interface{})
	if !ok {
		// Same as above -- if we can't get the hash we don't have a URL entry to remove
		return nil
	}
	_, ok = auths[url]
	if !ok {
		// Not an error if there's no URL (or auths)
		return nil
	}
	delete(auths, url)
	return saveParsedConfig(&config)
}
