import {
  IconBraces,
  IconCaretDown,
  IconCode,
  IconDatabase,
  IconFile,
  IconFileText,
  IconForms,
  IconX,
} from "@tabler/icons";
import get from "lodash/get";
import { updateRequestBodyMode } from "providers/ReduxStore/slices/collections";
import { updateRequestBody } from "providers/ReduxStore/slices/collections/index";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import MenuDropdown from "ui/MenuDropdown";
import { humanizeRequestBodyMode } from "utils/collections";
import { toastError } from "utils/common/error";
import { prettifyJsonString } from "utils/common/index";
import xmlFormat from "xml-formatter";
import StyledWrapper from "./StyledWrapper";

interface DEFAULT_MODESProps {
  item: unknown;
  collection: unknown;
}

const DEFAULT_MODES = [
  {
    name: "Form",
    options: [
      { id: "multipartForm", label: "Multipart Form", leftSection: IconForms },
      {
        id: "formUrlEncoded",
        label: "Form URL Encoded",
        leftSection: IconForms,
      },
    ],
  },
  {
    name: "Raw",
    options: [
      { id: "json", label: "JSON", leftSection: IconBraces },
      { id: "xml", label: "XML", leftSection: IconCode },
      { id: "text", label: "TEXT", leftSection: IconFileText },
      { id: "sparql", label: "SPARQL", leftSection: IconDatabase },
    ],
  },
  {
    name: "Other",
    options: [
      { id: "file", label: "File / Binary", leftSection: IconFile },
      { id: "none", label: "No Body", leftSection: IconX },
    ],
  },
];

const RequestBodyMode = ({ item, collection }: any) => {
  const dispatch = useDispatch();
  const body = item.draft
    ? get(item, "draft.request.body")
    : get(item, "request.body");
  const bodyMode = body?.mode;

  const onModeChange = useCallback(
    (value: any) => {
      dispatch(
        updateRequestBodyMode({
          itemUid: item.uid,
          collectionUid: collection.uid,
          mode: value,
        }),
      );
    },
    [dispatch, item.uid, collection.uid],
  );

  const onPrettify = () => {
    if (body?.json && bodyMode === "json") {
      try {
        const prettyBodyJson = prettifyJsonString(body.json);
        dispatch(
          updateRequestBody({
            content: prettyBodyJson,
            itemUid: item.uid,
            collectionUid: collection.uid,
          }),
        );
      } catch (e) {
        toastError(new Error("Unable to prettify. Invalid JSON format."));
      }
    } else if (body?.xml && bodyMode === "xml") {
      try {
        const prettyBodyXML = xmlFormat(body.xml, { collapseContent: true });
        dispatch(
          updateRequestBody({
            content: prettyBodyXML,
            itemUid: item.uid,
            collectionUid: collection.uid,
          }),
        );
      } catch (e) {
        toastError(new Error("Unable to prettify. Invalid XML format."));
      }
    }
  };

  const menuItems = useMemo(() => {
    return DEFAULT_MODES.map((group) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        onClick: () => onModeChange(option.id),
      })),
    }));
  }, [onModeChange]);

  return (
    <StyledWrapper>
      <div className="inline-flex items-center cursor-pointer body-mode-selector">
        <MenuDropdown
          items={menuItems}
          placement="bottom-end"
          selectedItemId={bodyMode}
          showGroupDividers={false}
          groupStyle="select"
        >
          <div className="flex items-center justify-center px-4 py-1 select-none selected-body-mode bg-gray-700 rounded-md">
            <span className="text-white">
              {humanizeRequestBodyMode(bodyMode)}
            </span>
            <IconCaretDown className="caret ml-1" size={14} strokeWidth={2} />
          </div>
        </MenuDropdown>
      </div>
      {(bodyMode === "json" || bodyMode === "xml") && (
        <button className="ml-2" onClick={onPrettify}>
          Prettify
        </button>
      )}
    </StyledWrapper>
  );
};
export default RequestBodyMode;
