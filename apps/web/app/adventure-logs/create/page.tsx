"use client";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import type { FieldProps } from "formik";
import { useMutation } from "convex/react";
import { useSearchBoxCore } from "@mapbox/search-js-react";
import type {
  SearchBoxFeatureProperties,
  SearchBoxSuggestion,
} from "@mapbox/search-js-core/dist/searchbox/types";
import { type Id, api } from "@repo/convex";
import { useDebounce, useGeoLocation } from "@repo/hooks";
import { useToast } from "@repo/ui/hooks";
import { Text, Input, Button, Loader } from "@repo/ui";
import { MapPinned } from "lucide-react";
import { UploadFileButton } from "../../components/UploadFileButton";
import { ImageBlock } from "../[id]/ImageBlock";

const validationSchema = Yup.object().shape({
  location: Yup.object()
    .shape({
      mapboxId: Yup.string().required(),
      type: Yup.string().required(),
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
      name: Yup.string().required(),
      fullAddress: Yup.string().required(),
      poiCategories: Yup.array(Yup.string().required()),
    })
    .required("Location is required"),
  showcaseFileId: Yup.string().required("Showcase image is required"),
});

interface LocationFormValue {
  mapboxId: string;
  type: string;
  latitude: string;
  longitude: string;
  name: string;
  fullAddress: string;
  poiCategories: string[];
}
interface CreateAdventureLogFormValues {
  location: LocationFormValue;
  showcaseFileId?: string;
}

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const createLog = useMutation(api.adventureLogs.create);

  async function onSubmit(values: CreateAdventureLogFormValues) {
    try {
      const newAdventureLogId = await createLog({
        location: {
          mapboxId: values.location.mapboxId,
          type: values.location.type,
          latitude: Number(values.location.latitude),
          longitude: Number(values.location.longitude),
          name: values.location.name,
          full_address: values.location.fullAddress,
          poiCategories: values.location.poiCategories,
        },
        showcaseFileId: values.showcaseFileId as Id<"files">,
      });
      toast({
        duration: 5000,
        title: "Success",
        description: "Adventure log saved as draft!",
      });
      router.push(`/adventure-logs/${newAdventureLogId}/edit/`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-background">
      <div className="q-full p-8 flex flex-row ">
        <Button
          variant="outline"
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </Button>
      </div>
      <div className="w-full max-w-[600px] p-8 mx-auto flex flex-col justify-center">
        <Text className="text-2xl font-black italic pb-16 text-center">
          Log an Adventure!
        </Text>
        <Formik<CreateAdventureLogFormValues>
          initialValues={{
            location: {
              mapboxId: "",
              type: "",
              latitude: "",
              longitude: "",
              name: "",
              fullAddress: "",
              poiCategories: [""],
            },
            showcaseFileId: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, isSubmitting }) => {
            return (
              <Form>
                {currentStep === 0 ? (
                  <>
                    <Text className="font-soleil pb-2">
                      Start by searching for your adventure location.
                    </Text>
                    <Field name="email">
                      {({ form, meta }: FieldProps) => (
                        <>
                          <LocationSearchInput
                            onChange={(location) => {
                              void form.setFieldValue("location", location);
                            }}
                          />
                          {meta.touched && meta.error ? (
                            <Text className="text-destructive">
                              {meta.error}
                            </Text>
                          ) : null}
                        </>
                      )}
                    </Field>
                  </>
                ) : null}
                {currentStep === 1 ? (
                  <>
                    <Text className="font-soleil pb-2">
                      Add a showcase photo or image.
                    </Text>

                    <Field name="email">
                      {({ form, meta }: FieldProps) => (
                        <>
                          {values.showcaseFileId ? (
                            <ImageBlock
                              fileId={values.showcaseFileId as Id<"files">}
                              className="mb-4"
                            />
                          ) : null}
                          <UploadFileButton
                            onSuccess={(fileIds) => {
                              void form.setFieldValue(
                                "showcaseFileId",
                                fileIds[0]
                              );
                            }}
                          >
                            Select showcase image
                          </UploadFileButton>
                          {meta.touched && meta.error ? (
                            <Text className="text-destructive">
                              {meta.error}
                            </Text>
                          ) : null}
                        </>
                      )}
                    </Field>
                  </>
                ) : null}

                {currentStep === 2 ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-8"
                  >
                    Save Draft
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={!values.location.name}
                    className="w-full mt-8"
                    onClick={() => {
                      setCurrentStep((s) => s + 1);
                    }}
                  >
                    Next
                  </Button>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

const searchToken = "log-an-adventure";

function LocationSearchInput({
  onChange,
}: {
  onChange: (location: LocationFormValue) => void;
}) {
  const { geo } = useGeoLocation();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<SearchBoxFeatureProperties | null>(null);

  const searchBoxCore = useSearchBoxCore({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "",
    country: "us",
    language: "en",
    proximity: geo?.coords
      ? [geo.coords.longitude, geo.coords.latitude]
      : undefined,
  });

  useEffect(() => {
    async function handleSearch() {
      if (debouncedSearchValue) {
        setIsSearching(true);
        const response = await searchBoxCore.suggest(debouncedSearchValue, {
          sessionToken: "log-an-adventure",
        });
        setSuggestions(response.suggestions);
        if (suggestions.length > 0) {
          setShowSuggestions(true);
        }
        setIsSearching(false);
      }
    }
    void handleSearch();
  }, [debouncedSearchValue, searchBoxCore, suggestions.length]);

  async function handleSelectLocation(suggestion: SearchBoxSuggestion) {
    const { features } = await searchBoxCore.retrieve(suggestion, {
      sessionToken: searchToken,
    });
    if (!features[0]) return;

    // eslint-disable-next-line -- This is a bug in the search-js-core types
    const newSelectedFeature = features[0].properties;
    // eslint-disable-next-line -- This is a bug in the search-js-core types
    setSelectedFeature(newSelectedFeature);
    onChange({
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      mapboxId: newSelectedFeature.mapbox_id,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      type: newSelectedFeature.feature_type,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      latitude: newSelectedFeature.coordinates.latitude.toString(),
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      longitude: newSelectedFeature.coordinates.longitude.toString(),
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      name: newSelectedFeature.name,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      fullAddress: newSelectedFeature.full_address,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      poiCategories: newSelectedFeature.poi_category,
    });
    setShowSuggestions(false);
  }

  return (
    <>
      {showSuggestions ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-[0]"
          onClick={() => {
            setShowSuggestions(false);
          }}
          onKeyUp={() => {
            setShowSuggestions(false);
          }}
          role="button"
          tabIndex={0}
        />
      ) : null}
      <div className="relative z-1 pb-4">
        <div className="relative flex flex-row items-center">
          <Input
            placeholder="Rocky Mountain National Park"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
            }}
            sizeY="lg"
            className="placeholder:italic "
          />
          {isSearching ? <Loader className="absolute right-4" /> : null}
        </div>

        {showSuggestions ? (
          <div className="w-full flex flex-col border rounded">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.mapbox_id}
                className="text-left text-sm px-4 py-2 hover:bg-muted"
                onClick={() => {
                  void handleSelectLocation(suggestion);
                }}
              >
                <span className="block w-full font-bold">
                  {suggestion.name}
                </span>
                {suggestion.full_address}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {selectedFeature ? (
        <div className="flex flex-row items-center">
          <MapPinned className="w-6 h-6 mx-4" />
          <div>
            <Text className="font-semibold">{selectedFeature.name}</Text>
            <Text>{selectedFeature.full_address}</Text>
          </div>
        </div>
      ) : null}
    </>
  );
}
