<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Topic;
use Infect\BackendBundle\Entity\TopicLocale;
use Infect\BackendBundle\Form\TopicType;

/**
 * Topic controller.
 *
 */
class TopicController extends Controller
{

    /**
     * Lists all Topic entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Topic')->findAll();

        return $this->render('InfectBackendBundle:Topic:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Topic entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Topic();
        $form = $this->createForm(new TopicType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $locales = array();
            foreach ($entity->getLocales() as $locale) 
            {
                $locales[] = $locale;
                $entity->removeLocale($locale);
            }

            $em->persist($entity);
            $em->flush();

            foreach($locales as $locale)
            {
                $entity->addLocale($locale);
                $em->persist($locale);
            }
            $em->flush();

            return $this->redirect($this->generateUrl('topic_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Topic:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Topic entity.
     *
     */
    public function newAction()
    {
        $entity = new Topic();
        $entity->addLocale(new TopicLocale());
        $form   = $this->createForm(new TopicType(), $entity);

        return $this->render('InfectBackendBundle:Topic:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Topic entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Topic')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Topic entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Topic:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Topic entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Topic')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Topic entity.');
        }

        $editForm = $this->createForm(new TopicType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Topic:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Topic entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Topic')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Topic entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new TopicType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {

            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getTopic() === $locale->getTopic()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }

            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('topic_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Topic:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Topic entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Topic')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Topic entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('topic'));
    }

    /**
     * Creates a form to delete a Topic entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
