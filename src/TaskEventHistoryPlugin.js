import { FlexPlugin } from "flex-plugin";
import React from "react";
import { SideLink, Actions } from "@twilio/flex-ui";
import TaskEventHistoryComponent from "./TaskEventHistoryComponent";

const PLUGIN_NAME = "TaskEventHistoryPlugin";

export default class TaskEventHistoryPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

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
              viewName: "TaskEventHistoryComponentView"
            })
          }
        >
          Event History Search
        </SideLink>
      );

      // Creates accessible view for reference
      flex.ViewCollection.Content.add(
        <flex.View name="TaskEventHistoryComponentView" key="taskHistory">
          <TaskEventHistoryComponent key="taskHistory" />
        </flex.View>
      );
    }
  }
}
