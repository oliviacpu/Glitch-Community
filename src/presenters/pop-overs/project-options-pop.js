import React from 'react';
import PropTypes from 'prop-types';

import { useTrackedFunc } from '../segment-analytics';
import PopoverWithButton from './popover-with-button';
import { NestedPopover } from './popover-nested';
import { useCurrentUser } from '../../state/current-user';

import AddProjectToCollectionPop from './add-project-to-collection-pop';

const PopoverButton = ({ onClick, text, emoji }) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick} type="button">
    <span>{`${text} `}</span>
    <span className={`emoji ${emoji}`} />
  </button>
);

// const ProjectOptionsContent = ({ addToCollectionPopover, ...props }) => {
//   function animate(event, className, func) {
//     const projectContainer = event.target.closest('li');
//     projectContainer.addEventListener('animationend', func, { once: true });
//     projectContainer.classList.add(className);
//     props.togglePopover();
//   }

//   function isTeamProject() {
//     const { currentUser, project } = props;
//     for (const team of currentUser.teams) {
//       if (project.teamIds.includes(team.id)) {
//         return true;
//       }
//     }
//     return false;
//   }

//   function leaveProject(event) {
//     if (isTeamProject()) {
//       props.leaveProject(props.project.id, event);
//       return;
//     }

//     const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${
//       props.project.domain
//     }?`;
//     if (window.confirm(prompt)) {
//       props.leaveProject(props.project.id, event);
//     }
//   }

//   function leaveTeamProject() {
//     props.leaveTeamProject(props.project.id, props.currentUser.id);
//   }

//   function joinTeamProject() {
//     props.joinTeamProject(props.project.id, props.currentUser);
//   }

//   function animateThenAddPin(event) {
//     animate(event, 'slide-up', () => props.addPin(props.project.id));
//   }

//   function animateThenRemovePin(event) {
//     animate(event, 'slide-down', () => props.removePin(props.project.id));
//   }

//   function animateThenDeleteProject(event) {
//     animate(event, 'slide-down', () => props.deleteProject(props.project.id));
//   }

//   function animateThenRemoveProjectFromTeam(event) {
//     animate(event, 'slide-down', () => props.removeProjectFromTeam(props.project.id));
//   }

//   function featureProject(event) {
//     animate(event, 'slide-up', () => props.featureProject(props.project.id));
//   }

//   function toggleAndDisplayNote() {
//     props.togglePopover();
//     props.displayNewNote(props.project.id);
//   }

//   const showLeaveProject = props.leaveProject && props.project.users.length > 1 && props.currentUserIsOnProject;
//   const showAddNote = !(props.project.note || props.project.isAddingANewNote) && !!props.displayNewNote;
//   const showPinOrFeatureSection = (props.addPin || props.removePin || (props.featureProject && !props.project.private));
//   const showRemoveProjectFromTeam = !!props.removeProjectFromTeam && !props.removeProjectFromCollection;
//   const showDeleteProject = props.currentUserIsAdminOnProject && !props.removeProjectFromCollection;
//   const showDangerZone = showRemoveProjectFromTeam || showDeleteProject || props.removeProjectFromCollection;

//   const onClickAddPin = useTrackedFunc(animateThenAddPin, 'Project Pinned');
//   const onClickRemovePin = useTrackedFunc(animateThenRemovePin, 'Project Un-Pinned');
//   const onClickLeaveTeamProject = useTrackedFunc(leaveTeamProject, 'Leave Project clicked');
//   const onClickLeaveProject = useTrackedFunc(leaveProject, 'Leave Project clicked');
//   const onClickDeleteProject = useTrackedFunc(animateThenDeleteProject, 'Delete Project clicked');

//   // TODO I think this component could be refactored to take a user type (anon/admin/collaborator/loggedinViewer)
//   // and render different components rather than determine what shows by what functions we have
//   // arguably this kind of determination on the type of user should happen in the user model rather than in this component
//   if (props.shouldShowAnonView) {
//     return (
//       <dialog className="pop-over project-options-pop">
//         {showLeaveProject && (
//           <section className="pop-over-actions collaborator-actions">
//             <PopoverButton onClick={onClickLeaveProject} text="Leave Project " emoji="wave" />
//           </section>
//         )}
//         {showDeleteProject && (
//           <section className="pop-over-actions danger-zone last-section">
//             <PopoverButton onClick={onClickDeleteProject} text="Delete Project " emoji="bomb" />
//           </section>
//         )}
//       </dialog>
//     );
//   }

//   return (
//     <dialog className="pop-over project-options-pop">
//       {showPinOrFeatureSection && (
//         <section className="pop-over-actions">
//           {!!props.featureProject && !props.project.private && (
//             <PopoverButton onClick={featureProject} text="Feature" emoji="clapper" />
//           )}
//           {!!props.addPin && (
//             <PopoverButton onClick={onClickAddPin} text="Pin " emoji="pushpin" />
//           )}
//           {!!props.removePin && (
//             <PopoverButton onClick={onClickRemovePin} text="Un-Pin " emoji="pushpin" />
//           )}
//         </section>
//       )}
//       {showAddNote && (
//         <section className="pop-over-actions">
//           <PopoverButton onClick={toggleAndDisplayNote} {...props} text="Add Note" emoji="spiral_note_pad" />
//         </section>
//       )}

//       {!!props.addProjectToCollection && (
//         <section className="pop-over-actions">
//           <PopoverButton onClick={addToCollectionPopover} {...props} text="Add to Collection " emoji="framed-picture" />
//         </section>
//       )}

//       {props.joinTeamProject && !props.currentUserIsOnProject && (
//         <section className="pop-over-actions collaborator-actions">
//           <PopoverButton onClick={joinTeamProject} text="Join Project " emoji="rainbow" />
//         </section>
//       )}

//       {props.leaveTeamProject && props.currentUserIsOnProject && (
//         <section className="pop-over-actions collaborator-actions">
//           <PopoverButton onClick={onClickLeaveTeamProject} text="Leave Project " emoji="wave" />
//         </section>
//       )}

//       {showLeaveProject && (
//         <section className="pop-over-actions collaborator-actions">
//           <PopoverButton onClick={onClickLeaveProject} text="Leave Project " emoji="wave" />
//         </section>
//       )}

//       {showDangerZone && (
//         <section className="pop-over-actions danger-zone last-section">
//           {showRemoveProjectFromTeam && (
//             <PopoverButton onClick={animateThenRemoveProjectFromTeam} text="Remove Project " emoji="thumbs_down" />
//           )}

//           {showDeleteProject && (
//             <PopoverButton onClick={onClickDeleteProject} text="Delete Project " emoji="bomb" />
//           )}

//           {props.removeProjectFromCollection && (
//             <PopoverButton onClick={() => props.removeProjectFromCollection(props.project)} text="Remove from Collection" emoji="thumbs_down" />
//           )}
//         </section>
//       )}
//     </dialog>
//   );
// };


const ProjectOptionsContent = (props) => {
  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, { once: true });
    projectContainer.classList.add(className);
    props.togglePopover();
  }
  function toggleAndCB(cb) {
    props.togglePopover();
    cb();
  }
  const showPinOrFeatureSection = props.addPin || props.removePin || props.featureProject;
  const onClickLeaveTeamProject = useTrackedFunc(props.leaveTeamProject, 'Leave Project clicked');

  return (
    <dialog className="pop-over project-options-pop">

      {showPinOrFeatureSection && (
        <section className="pop-over-actions">
          {props.featureProject && (
            <PopoverButton onClick={(e) => animate(e, 'slide-up', props.featureProject)} text="Feature" emoji="clapper" />
          )}
          {props.addPin && (
            <PopoverButton onClick={(e) => animate(e, 'slide-up', props.addPin)} text="Pin " emoji="pushpin" />
          )}
          {props.removePin && (
            <PopoverButton onClick={(e) => animate(e, 'slide-down', props.removePin)} text="Un-Pin " emoji="pushpin" />
          )}
        </section>
      )}

      {props.addNote && (
        <section className="pop-over-actions">
          <PopoverButton onClick={() => toggleAndCB(props.addNote)} text="Add Note" emoji="spiral_note_pad" />
        </section>
      )}

      {props.addProjectToCollection && (
        <section className="pop-over-actions">
          <PopoverButton onClick={props.addToCollectionPopover} text="Add to Collection " emoji="framed-picture" />
        </section>
      )}

      {props.joinTeamProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={props.joinTeamProject} text="Join Project " emoji="rainbow" />
        </section>
      )}

      {props.leaveTeamProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={onClickLeaveTeamProject} text="Leave Project " emoji="wave" />
        </section>
      )}

    </dialog>
  );
};

// Project Options Pop
const ProjectOptionsPop = ({ ...props }) => (
  <NestedPopover alternateContent={() => <AddProjectToCollectionPop {...props} togglePopover={props.togglePopover} />}>
    {(addToCollectionPopover) => <ProjectOptionsContent {...props} addToCollectionPopover={addToCollectionPopover} />}
  </NestedPopover>
);

ProjectOptionsPop.propTypes = {
  // currentUser: PropTypes.object.isRequired,
  // project: PropTypes.shape({
  //   users: PropTypes.array.isRequired,
  // }).isRequired,
  // togglePopover: PropTypes.func.isRequired,
  // addPin: PropTypes.func,
  // removePin: PropTypes.func,
  // deleteProject: PropTypes.func,
  // leaveProject: PropTypes.func,
  // removeProjectFromTeam: PropTypes.func,
  // joinTeamProject: PropTypes.func,
  // leaveTeamProject: PropTypes.func,
  // featureProject: PropTypes.func,
  // currentUserIsOnProject: PropTypes.bool,
  // displayNewNote: PropTypes.func,
};
ProjectOptionsPop.defaultProps = {
  // currentUserIsOnProject: false,
  // addPin: null,
  // removePin: null,
  // deleteProject: null,
  // leaveProject: null,
  // removeProjectFromTeam: null,
  // joinTeamProject: null,
  // leaveTeamProject: null,
  // featureProject: null,
  // displayNewNote: null,
};

const determineProjectOptions = (props, currentUser) => {
  const isAnon = !(currentUser && currentUser.login);
  const currentUserIsOnProject = currentUser && props.project.users.map((projectUser) => projectUser.id).includes(currentUser.id);
  
  return {
    featureProject: props.projectOptions.featureProject && !props.project.private && !isAnon ? () => props.projectOptions.featureProject(props.project.id) : null,
    addPin: props.projectOptions.addPin && !isAnon ? () => props.projectOptions.addPin(props.project.id) : null,
    removePin: props.projectOptions.removePin && !isAnon ? () => props.projectOptions.removePin(props.project.id) : null,
    addNote: !(props.project.note || props.project.isAddingANewNote) && props.projectOptions.displayNewNote && !isAnon ? () => props.projectOptions.displayNewNote(props.project.id) : null,
    addProjectToCollection: props.projectOptions.addProjectToCollection && !isAnon ? props.projectOptions.addProjectToCollection : null, 
    joinTeamProject: props.projectOptions.joinTeamProject && !currentUserIsOnProject && !isAnon ? props.projectOptions.joinTeamProject(props.project.id, currentUser.id) : null,
    leaveTeamProject: props.projectOptions.leaveTeamProject && currentUserIsOnProject && !isAnon ? props.projectOptions.leaveTeamProject(props.project.id, currentUser.id) : null,
    leaveProject: null,
    removeProjectFromTeam: null,
    deleteProject: null,
    removeProjectFromCollection: null,
  }
}

export default function ProjectOptions(props) {
  const { currentUser } = useCurrentUser();

  const projectOptions = determineProjectOptions(props, currentUser);

  const noProjectOptions = Object.values(projectOptions).every(option => !option);
  if (noProjectOptions) {
    return null;
  }
  
  return (
    <PopoverWithButton
      buttonClass="project-options button-borderless button-small"
      buttonText={<div className="down-arrow" aria-label="options" />}
      containerClass="project-options-pop-btn"
    >
      {({ togglePopover }) => (
        <ProjectOptionsPop
          {...props}
          {...projectOptions}
          togglePopover={togglePopover}
        />
      )}
    </PopoverWithButton>
  );
}

// Project Options Container
// create as stateful react component
// export default function ProjectOptions({ projectOptions, project }, { ...props }) {
//   const { currentUser } = useCurrentUser();
//   if (Object.keys(projectOptions).length === 0) {
//     return null;
//   }

//   function currentUserIsOnProject(user) {
//     const projectUsers = project.users.map((projectUser) => projectUser.id);
//     if (projectUsers.includes(user.id)) {
//       return true;
//     }
//     return false;
//   }

//   function currentUserIsAdminOnProject(user) {
//     const projectPermissions = project && project.permissions && project.permissions.find((p) => p.userId === user.id);
//     return projectPermissions && projectPermissions.accessLevel === 30;
//   }

//   const showLeaveProject = projectOptions.leaveProject && project.users.length > 1 && currentUserIsOnProject(currentUser);
//   const showDeleteProject = currentUserIsAdminOnProject(currentUser) && !projectOptions.removeProjectFromCollection;
//   const isAnon = !(currentUser && currentUser.login);
//   const shouldShowAnonView = isAnon && (showLeaveProject || showDeleteProject);

//   if (isAnon && !shouldShowAnonView) {
//     return null;
//   }

//   return (
//     <PopoverWithButton
//       buttonClass="project-options button-borderless button-small"
//       buttonText={<div className="down-arrow" aria-label="options" />}
//       containerClass="project-options-pop-btn"
//     >
//       {({ togglePopover }) => (
//         <ProjectOptionsPop
//           {...props}
//           {...projectOptions}
//           project={project}
//           currentUser={currentUser}
//           currentUserIsOnProject={currentUserIsOnProject(currentUser)}
//           currentUserIsAdminOnProject={currentUserIsAdminOnProject(currentUser)}
//           shouldShowAnonView={shouldShowAnonView}
//           togglePopover={togglePopover}
//         />
//       )}
//     </PopoverWithButton>
//   );
// }

ProjectOptions.propTypes = {
  project: PropTypes.object.isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptions.defaultProps = {
  projectOptions: {},
};
