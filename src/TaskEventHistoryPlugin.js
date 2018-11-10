import { FlexPlugin } from "flex-plugin";
import React from "react";
import { SideLink, Actions } from "@twilio/flex-ui";
import TaskEventHistoryComponent from "./TaskEventHistoryComponent";

export default class TaskEventHistoryPlugin extends FlexPlugin {
  pluginName = "TaskEventHistoryPlugin";

  init(flex, manager) {
    //adds the task button to the navbar if user is admin
    if (
      manager._store
        .getState()
        .flex.session.ssoTokenPayload.roles.indexOf("admin") !== -1 ||
      manager._store
        .getState()
        .flex.worker.attributes.roles.indexOf("admin") !== -1
    ) {
      flex.SideNav.Content.add(
        <SideLink
          key="TaskEventHistory"
          icon="Cogs"
          onClick={() =>
            Actions.invokeAction("NavigateToView", {
              viewName: "TaskHistoryComponentView"
            })
          }
        />
      );

      // Creates accessible view for reference
      flex.ViewCollection.Content.add(
        <flex.View name="TaskHistoryComponentView" key="taskHistory">
          <TaskEventHistoryComponent key="taskHistory" />
        </flex.View>
      );
    }
  }
}
