import React, { useMemo } from 'react'
import { clearForm, useCancel, useForm, useSubmit } from '@/components/Ui/Form'
import { ModelData } from '@/models/base/Model'
import Transport, { parseTransport } from '@/models/Transport'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UiForm from '@/components/Ui/Form/UiForm'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import TransportStore from '@/stores/TransportStore'
import UiSelectInput from '@/components/Ui/Input/Select/UiSelectInput'
import Incident from '@/models/Incident'
import UserStore, { useUsers } from '@/stores/UserStore'
import User from '@/models/User'
import Id from '@/models/base/Id'
import { useValidate } from '@/components/Ui/Form/validate'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTextArea from '@/components/Ui/Input/Text/UiTextArea'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'
import UiDateInput from '@/components/Ui/Input/Date/UiDateInput'
import styled from 'styled-components'
import { useCurrentUser } from '@/stores/SessionStore'
import UiNumberInput from '@/components/Ui/Input/Number/UiNumberInput'
import { Themed } from '@/theme'
import Vehicle, { parseVehicle } from '@/models/Vehicle'
import VehicleStore, { useVehicles } from '@/stores/VehicleStore'
import { useEffectOnce } from 'react-use'
import Trailer, { parseTrailer } from '@/models/Trailer'
import TrailerStore, { useTrailers } from '@/stores/TrailerStore'

interface Props {
  incident: Incident
  transport?: Transport | null
  onSave?: (transport: Transport) => void
  onClose?: () => void
}

const TransportForm: React.VFC<Props> = ({
  incident,
  transport = null,
  onSave: handleSave,
  onClose: handleClose,
}) => {
  const currentUser = useCurrentUser()

  const form = useForm<ModelData<Transport>>(transport, () => ({
    title: '',
    description: null,
    incidentId: incident.id,
    assigneeId: currentUser.id,
    priority: Priority.MEDIUM,
    peopleInvolved: 0,
    driver: null,
    vehicleId: null,
    trailerId: null,
    pointOfDeparture: null,
    pointOfArrival: null,
    startsAt: null,
    endsAt: null,
    isClosed: false,
  }))

  useValidate(form, (validate) => {
    return ({
      title: [
        validate.notBlank(),
        validate.maxLength(100),
      ],
      description: [
        validate.notBlank({ allowNull: true }),
      ],
      pointOfDeparture: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      pointOfArrival: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      trailerId: [],
      vehicleId: [
        validate.notNull(),
      ],
      driver: [
        validate.notBlank({ allowNull: true }),
        validate.maxLength(100),
      ],
      peopleInvolved: [
        (value) => value >= 0 || 'muss positiv sein',
      ],
      priority: [
        validate.notNull(),
      ],
      isClosed: [],
      startsAt: [],
      endsAt: [],
      assigneeId: [],
      incidentId: [],
    })
  })

  useSubmit(form, async (formData: ModelData<Transport>) => {
    const [data, error]: BackendResponse<Transport> = transport === null
      ? await BackendService.create(`incidents/${incident.id}/transports`, formData)
      : await BackendService.update(`incidents/${incident.id}/transports`, transport.id, formData)
    if (error !== null) {
      throw error
    }
    const newTransport = parseTransport(data)
    TransportStore.save(newTransport)
    if (handleSave) {
      handleSave(newTransport)
    }
    clearForm(form)
    if (handleClose) {
      handleClose()
    }
  })

  useCancel(form, handleClose)

  useEffectOnce(function loadVisibleVehiclesAndTrailers() {
    (async () => {
      // Load and save the visible vehicles.
      const [vehicles, vehiclesError]: BackendResponse<Vehicle[]> = await BackendService.list(
        'vehicles/visible',
      )
      if (vehiclesError !== null) {
        throw vehiclesError
      }
      VehicleStore.saveAll(vehicles.map(parseVehicle))

      // Load and save the visible trailers
      const [trailers, trailersError]: BackendResponse<Trailer[]> = await BackendService.list(
        'trailers/visible',
      )
      if (trailersError !== null) {
        throw trailersError
      }
      TrailerStore.saveAll(trailers.map(parseTrailer))
    })()
  })

  const handleCreateVehicle = async (vehicleName: string) => {
    // Validate vehicle name
    if (vehicleName.length > 100) {
      alert('Fahrzeugname ist zu lang.')
      return
    }

    // Create and save the new vehicle
    const [data, error]: BackendResponse<Vehicle> = await BackendService.create('vehicles', {
      name: vehicleName,
      isVisible: true,
    })
    if (error !== null) {
      throw error
    }
    VehicleStore.save(parseVehicle(data))

    // Update the vehicle select value
    form.vehicleId.setValue(data.id)
  }

  const handleDeleteVehicle = async (id: Id<Vehicle>) => {
    // Load the vehicle and update the visibility
    const [data, error]: BackendResponse<Vehicle> = await BackendService.find('vehicles', id)
    if (error !== null) {
      throw error
    }
    data.isVisible = false

    // Update and save the vehicle
    const [updatedVehicle, updatedVehicleError]: BackendResponse<Vehicle> = await BackendService.update('vehicles', id, data)
    if (updatedVehicleError !== null) {
      throw updatedVehicleError
    }
    VehicleStore.save(parseVehicle(updatedVehicle))
  }

  const handleCreateTrailer = async (trailerName: string) => {
    // Validate trailer name
    if (trailerName.length > 100) {
      alert('Anhängername ist zu lang.')
      return
    }

    // Create and save the new trailer
    const [data, error]: BackendResponse<Trailer> = await BackendService.create('trailers', {
      name: trailerName,
      isVisible: true,
    })
    if (error !== null) {
      throw error
    }
    TrailerStore.save(parseTrailer(data))

    // Update the trailer select value
    form.trailerId.setValue(data.id)
  }

  const handleDeleteTrailer = async (id: Id<Trailer>) => {
    // Load the trailer and update the visibility
    const [data, error]: BackendResponse<Trailer> = await BackendService.find('trailers', id)
    if (error !== null) {
      throw error
    }
    data.isVisible = false

    // Update and save the trailer
    const [updatedTrailer, updatedTrailerError]: BackendResponse<Trailer> = await BackendService.update('trailers', id, data)
    if (updatedTrailerError !== null) {
      throw updatedTrailerError
    }
    TrailerStore.save(parseTrailer(updatedTrailer))
  }

  // Filter the visible vehicles and map their ids
  const vehicles = useVehicles((records) => records.filter((e) => e.isVisible))
  const vehicleIds = useMemo(() => {
    return vehicles.map(({ id }) => id)
  }, [vehicles])

  // Filter the visible trailers and map their ids
  const trailers = useTrailers((records) => records.filter((e) => e.isVisible))
  const trailerIds = useMemo(() => {
    return trailers.map(({ id }) => id)
  }, [trailers])

  const userIds = useUsers((users) => users.map(({ id }) => id))

  return (
    <div>
      <UiForm form={form}>
        <FormContainer>
          <PrioritySliderPositioner>
            <UiForm.Field field={form.priority}>{(props) => (
              <UiPrioritySlider {...props} />
            )}</UiForm.Field>
          </PrioritySliderPositioner>

          <UiForm.Field field={form.title}>{(props) => (
            <UiTextInput {...props} label="Titel" />
          )}</UiForm.Field>

          <UiForm.Field field={form.description}>{(props) => (
            <UiTextArea {...props} label="Beschreibung" />
          )}</UiForm.Field>

          <UiForm.Field field={form.driver}>{(props) => (
            <UiTextInput {...props} label="Fahrer" />
          )}</UiForm.Field>

          <UiForm.Field field={form.peopleInvolved}>{(props) => (
            <UiNumberInput {...props} label="Anz. Personen" />
          )}</UiForm.Field>

          {/* Vehicle select input with creation and deletion functionality */}
          <UiForm.Field field={form.vehicleId} deps={[vehicles]}>{(props) => (
            <UiSelectInput
              {...props}
              label="Fahrzeug"
              options={vehicleIds}
              optionName={mapVehicleIdToName}
              menuPlacement="auto"
              isSearchable
              onCreate={handleCreateVehicle}
              onDelete={handleDeleteVehicle}
            />
          )}</UiForm.Field>

          {/* Trailer select input with the creation and deletion functionality */}
          <UiForm.Field field={form.trailerId} deps={[trailers]}>{(props) => (
            <UiSelectInput
              {...props}
              label="Anhänger"
              options={trailerIds}
              optionName={mapTrailerIdToName}
              menuPlacement="auto"
              isSearchable
              onCreate={handleCreateTrailer}
              onDelete={handleDeleteTrailer}
            />
          )}</UiForm.Field>

          <UiGrid gapH={1}>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>
              <UiForm.Field field={form.pointOfDeparture}>{(props) => (
                <UiTextInput {...props} label="Abfahrtsort" />
              )}</UiForm.Field>
            </UiGrid.Col>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>

              <UiForm.Field field={form.pointOfArrival}>{(props) => (
                <UiTextInput {...props} label="Ankunftsort" />
              )}</UiForm.Field>
            </UiGrid.Col>
          </UiGrid>

          <UiForm.Field field={form.assigneeId}>{(props) => (
            <UiSelectInput
              {...props}
              label="Zuweisung"
              options={userIds}
              optionName={mapUserIdToName}
              menuPlacement="top"
            />
          )}</UiForm.Field>

          <UiGrid gapH={1}>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>
              <UiForm.Field field={form.startsAt}>{(props) => (
                <UiDateInput {...props} label="Beginn" placement="top" />
              )}</UiForm.Field>
            </UiGrid.Col>
            <UiGrid.Col size={{ xs: 12, md: 6 }}>

              <UiForm.Field field={form.endsAt}>{(props) => (
                <UiDateInput {...props} label="Ende" placement="top" />
              )}</UiForm.Field>
            </UiGrid.Col>
          </UiGrid>

          <UiForm.Buttons form={form} text={transport === null ? 'Erstellen' : 'Speichern'} />
        </FormContainer>
      </UiForm>
    </div>
  )
}
export default TransportForm

const mapUserIdToName = (id: Id<User>): string | null => {
  const user = UserStore.find(id)
  return user === null
    ? null
    : `${user.firstName} ${user.lastName}`
}

/**
 * Maps the id of a vehicle to its name.
 *
 * @param id The id of the vehicle.
 * @return The vehicle's name.
 */
const mapVehicleIdToName = (id: Id<Vehicle>): string => {
  const vehicle = VehicleStore.find(id)
  return vehicle === null
    ? '-'
    : vehicle.name
}

/**
 * Maps the id of a trailer to its name.
 *
 * @param id The id of the trailer.
 * @return The trailer's name.
 */
const mapTrailerIdToName = (id: Id<Trailer>): string | null => {
  const trailer = TrailerStore.find(id)
  return trailer === null
    ? '-'
    : trailer.name
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PrioritySliderPositioner = styled.div`
  display: flex;
  justify-content: right;
  margin: 0.5rem;

  ${Themed.media.sm.max} {
    justify-content: center;
  }
`
